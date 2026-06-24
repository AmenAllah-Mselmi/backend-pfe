import { Injectable } from '@nestjs/common';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Lead, Prisma } from '@prisma/client';
import * as fs from 'fs';
import csvParser = require('csv-parser');
import { LeadStatus } from '@prisma/client';
@Injectable()
export class LeadsService {
  constructor(private readonly prisma: PrismaService,
  ) { }
  async create(createLeadDto: CreateLeadDto, user: any) {
    const { companyId, ...rest } = createLeadDto;

    const data: any = { 
      ...rest, 
      userId: user.sub ? Number(user.sub) : null 
    };

    if (companyId && Number(companyId) > 0) {
      const company = await this.prisma.company.findUnique({ where: { id: Number(companyId) } });
      if (company) {
        data.companyId = company.id;
      } else {
        throw new Error(`The selected company (ID: ${companyId}) could not be found.`);
      }
    }

    try {
      return await this.prisma.lead.create({ 
        data,
        include: { company: true }
      });
    } catch (error) {
      console.error('Lead Creation Error:', error);
      
      if (error.code === 'P2002') {
        const target = error.meta?.target || 'email/userId';
        throw new Error(`Conflict: A lead with this ${target} already exists.`);
      }
      
      if (error.code === 'P2003') {
        throw new Error(`Foreign key constraint failed. Check if provided IDs (company, pipeline, etc.) are valid.`);
      }

      throw new Error(`Database Error: ${error.message || 'Unknown database error occurred'}`);
    }
  }

  async findAll(user: any, options?: { page?: number; limit?: number; search?: string }) {
    const { page = 1, limit = 10, search } = options || {};
    const skip = (page - 1) * limit;

    const baseWhere = user.role === 'ADMIN' 
      ? { OR: [{ userId: user.sub }, { user: { managerId: user.sub } }] }
      : { userId: user.sub };

    const whereClause = search
      ? { AND: [baseWhere, { name: { contains: search } }] }
      : baseWhere;
      
    const [data, total] = await Promise.all([
      this.prisma.lead.findMany({ 
        where: whereClause,
        include: { company: true, leadScore: true },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.lead.count({ where: whereClause })
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async findOne(id: number) {
    const lead = await this.prisma.lead.findUnique({
      where: { id },
    });
    if (!lead) {
      throw new Error(`Lead with id ${id} not found`);
    }
    return lead;
  }

  async update(id: number, updateLeadDto: UpdateLeadDto) {
    const lead = await this.prisma.lead.findUnique({
      where: { id },
    });
    if (!lead) {
      throw new Error(`Lead with id ${id} not found`);
    }
    const updatedLead = await this.prisma.lead.update({
      where: { id },
      data: updateLeadDto,
    });

    if (updateLeadDto.status && updateLeadDto.status !== lead.status) {
      await this.prisma.activity.create({
        data: {
          type: 'lead_status_change',
          title: 'Lead Status Changed',
          description: `Lead "${updatedLead.name}" status changed to ${updateLeadDto.status}`,
          entity: 'lead',
          entityId: updatedLead.id,
          userId: updatedLead.userId || 1,
          metadata: { entityName: updatedLead.name, oldStatus: lead.status, newStatus: updateLeadDto.status }
        }
      });
    }

    return updatedLead;
  }

  async remove(id: number) {
    const lead = await this.prisma.lead.findUnique({
      where: { id },
    });
    if (!lead) {
      throw new Error(`Lead with id ${id} not found`);
    }
    return this.prisma.lead.delete({
      where: { id },
    });
  }
  async findbyUserId(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new Error(`User with id ${userId} not found`);
    }
    const emails = await this.prisma.email.findMany({
      where: {
        userId
      },
      include: {
        lead: true
      }
    })
    let leads: Lead[] = [];
    if ((emails).length !== 0) {
      leads = emails.map((element) => {
        return element.lead
      })
    }
    return leads
  }
    async importCsv(filePath: string) {
      const batchSize = 1000;
      let batch: Prisma.LeadCreateManyInput[] = [];
      let inserted = 0;
      let parsed = 0;
      let skipped = 0;
      let derived = 0;

      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      }

      return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(csvParser())
          .on('data', async (row) => {
            parsed++;

            // normalize header keys to lowercase trimmed
            const normalized: any = {};
            Object.keys(row).forEach(k => {
              const key = String(k).trim().toLowerCase();
              const v = row[k];
              normalized[key] = typeof v === 'string' ? v.trim() : v;
            });

            const keys = Object.keys(normalized);
            const findKey = (candidates: string[]) => keys.find(k => candidates.some(c => k.includes(c)));

            const nameKey = findKey(['name', 'nom', 'full name', 'fullname', 'first_name', 'firstname', 'prenom', 'contact']);
            const emailKey = findKey(['email', 'e-mail', 'courriel', 'mail']);
            const phoneKey = findKey(['phone', 'telephone', 'tel']);
            const companyIdKey = findKey(['companyid', 'company id', 'company_id', 'societeid', 'societe_id']);
            const probabilityKey = findKey(['probability', 'prob']);
            const dealValueKey = findKey(['dealvalue', 'deal_value', 'value']);
            const expectedCloseDateKey = findKey(['expectedclosedate', 'expected_close_date', 'expected close date']);
            const pipelineIdKey = findKey(['pipelineid', 'pipeline id', 'pipeline_id']);

            let nameValue = nameKey ? normalized[nameKey] : undefined;
            if (!nameValue && (normalized['first_name'] || normalized['last_name'] || normalized['prenom'])) {
              nameValue = `${normalized['first_name'] || normalized['prenom'] || ''} ${normalized['last_name'] || ''}`.trim();
            }

            const item: any = {
              name: nameValue,
              email: emailKey ? normalized[emailKey] : undefined,
              phone: phoneKey ? normalized[phoneKey] : undefined,
              status: normalized['status'],
              probability: probabilityKey ? (normalized[probabilityKey] ? Number(normalized[probabilityKey]) : undefined) : undefined,
              companyId: companyIdKey ? (normalized[companyIdKey] ? Number(normalized[companyIdKey]) : undefined) : undefined,
              currency: normalized['currency'],
              dealValue: dealValueKey ? (normalized[dealValueKey] ? Number(normalized[dealValueKey]) : undefined) : undefined,
              expectedCloseDate: expectedCloseDateKey ? normalized[expectedCloseDateKey] : undefined,
              pipelineId: pipelineIdKey ? (normalized[pipelineIdKey] ? Number(normalized[pipelineIdKey]) : undefined) : undefined,
            };

            // remove empty/undefined
            Object.keys(item).forEach(key => {
              if (item[key] === undefined || item[key] === '') delete item[key];
            });

            // derive name from email if missing
            if (!item.name && item.email) {
              item.name = String(item.email).split('@')[0];
              derived++;
            }

            if (!item.name) { skipped++; return; }

            batch.push(item as Prisma.LeadCreateManyInput);

            if (batch.length >= batchSize) {
              try {
                await this.prisma.lead.createMany({ data: batch });
                inserted += batch.length;
                batch = [];
              } catch (err) {
                reject(err);
              }
            }
          })
          .on('end', async () => {
            if (batch.length > 0) {
              await this.prisma.lead.createMany({ data: batch });
              inserted += batch.length;
            }
            resolve({ inserted, parsed, skipped, derived });
          })
          .on('error', reject);
      });
  }

 async importBulk(data: any[], user: any) {
  const mapLeadStatus = (status: any): LeadStatus => {
    if (!status) return LeadStatus.NEW;
    const s = String(status).toUpperCase().trim();
    if (s.includes('QUALIFIED')) return LeadStatus.QUALIFIED;
    if (s.includes('CONTACTED') || s.includes('NEGOTIATION') || s.includes('PROPOSAL') || s.includes('PROSPECTING')) return LeadStatus.CONTACTED;
    if (s.includes('WON')) return LeadStatus.QUALIFIED;
    if (s.includes('LOST')) return LeadStatus.LOST;
    return LeadStatus.NEW;
  };

  let added = 0;
  let updated = 0;
  let unchanged = 0;

  for (const item of data) {
    if (!item.email && !item.phone) continue;

    const mappedItem = {
      ...item,
      status: mapLeadStatus(item.status),
      userId: user.sub,
    };

    // ✅ CORRECT: Use the compound unique constraint
    const existing = await this.prisma.lead.findUnique({
      where: {
        email_userId: {  // This is the compound key name (Prisma generates this)
          email: item.email,
          userId: user.sub,
        }
      },
    });

    if (!existing) {
      await this.prisma.lead.create({ data: mappedItem });
      added++;
    } else {
      // Check if anything actually changed
      let isDifferent = false;
      if (mappedItem.name && mappedItem.name !== existing.name) isDifferent = true;
      if (mappedItem.phone && mappedItem.phone !== existing.phone) isDifferent = true;
      if (mappedItem.dealValue && mappedItem.dealValue !== existing.dealValue) isDifferent = true;
      if (item.status && mappedItem.status !== existing.status) isDifferent = true;

      if (isDifferent) {
        await this.prisma.lead.update({
          where: { id: existing.id },
          data: mappedItem,
        });
        updated++;
      } else {
        unchanged++;
      }
    }
  }
  
  return { added, updated, unchanged };
}
}
