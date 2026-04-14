import { Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as fs from 'fs';
import csvParser = require('csv-parser');
import { Prisma, ContactStatus } from '@prisma/client';

@Injectable()
export class ContactsService {
  constructor(private readonly prisma: PrismaService) {
  }
  async create(createContactDto: CreateContactDto, user: any) {
    const { companyId, ...rest } = createContactDto;

  const data: any = { ...rest, userId: user.sub };
  if (companyId) {
    const company = await this.prisma.company.findUnique({ where: { id: companyId } });
    if (company) data.company = { connect: { id: companyId } }
    ;
  }
    return await this.prisma.contact.create({
      data
    });
  }

  async findAll(user: any) {
    const whereClause = user.role === 'ADMIN'
      ? { OR: [{ userId: user.sub }, { user: { managerId: user.sub } }] }
      : { userId: user.sub };

    return await this.prisma.contact.findMany({
      where: whereClause
    });
  }

  async findOne(id: number) {
    const contact = await this.prisma.contact.findUnique({
      where: { id },
    });
    if (!contact) {
      throw new Error(`Contact with id ${id} not found`);
    }
    return contact;
  }

  async update(id: number, updateContactDto: UpdateContactDto) {
    const contact = await this.prisma.contact.findUnique({
      where: { id },
    });
    if (!contact) {
      throw new Error(`Contact with id ${id} not found`);
    }
    return await this.prisma.contact.update({
      where: { id },
      data: updateContactDto,
    });
  }

  async remove(id: number) {
    const contact = await this.prisma.contact.findUnique({
      where: { id },
    });
    if (!contact) {
      throw new Error(`Contact with id ${id} not found`);
    }
    return await this.prisma.contact.delete({
      where: { id },
    });
  }
  async importCsv(filePath: string) {
    const batchSize = 1000;
    let batch: Prisma.ContactCreateManyInput[] = [];
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

          const normalized: any = {};
          Object.keys(row).forEach(k => {
            const key = String(k).trim().toLowerCase();
            const v = row[k];
            normalized[key] = typeof v === 'string' ? v.trim() : v;
          });

          let nameValue = normalized['name'] || normalized['full name'] || normalized['firstname'] || normalized['first_name'] || normalized['first name'];
          if (!nameValue && (normalized['first_name'] || normalized['last_name'])) {
            nameValue = `${normalized['first_name'] || ''} ${normalized['last_name'] || ''}`.trim();
          }

          const item: any = {
            name: nameValue,
            email: normalized['email'],
            phone: normalized['phone'],
            companyId: normalized['companyid'] ? Number(normalized['companyid']) : undefined,
            status: normalized['status'],
          };

          Object.keys(item).forEach(key => {
            if (item[key] === undefined || item[key] === '') delete item[key];
          });

          if (!item.name && item.email) {
            item.name = String(item.email).split('@')[0];
            derived++;
          }

          if (!item.name) { skipped++; return; }

          batch.push(item as Prisma.ContactCreateManyInput);

          if (batch.length >= batchSize) {
            try {
              await this.prisma.contact.createMany({ data: batch });
              inserted += batch.length;
              batch = [];
            } catch (err) {
              reject(err);
            }
          }
        })
        .on('end', async () => {
          if (batch.length > 0) {
            await this.prisma.contact.createMany({ data: batch });
            inserted += batch.length;
          }
          resolve({ inserted, parsed, skipped, derived });
        })
        .on('error', reject);
    });
  }

async importBulk(data: any[], user: any) {
  const mapContactStatus = (status: any): ContactStatus => {
    if (!status) return ContactStatus.ACTIVE;
    const s = String(status).toUpperCase().trim();
    if (s.includes('INACTIVE')) return ContactStatus.INACTIVE;
    return ContactStatus.ACTIVE;
  };

  let added = 0;
  let updated = 0;
  let unchanged = 0;
  let skipped = 0; // Track skipped records

  for (const item of data) {
    if (!item.name && !item.email) continue;
    
    const email = item.email || `${item.name.replace(/\s+/g, '').toLowerCase()}@example.com`;

    // Validate company if provided
    let validCompanyId = undefined;
    if (item.companyId) {
      const companyId = Number(item.companyId);
      const companyExists = await this.prisma.company.findUnique({
        where: { id: companyId }
      });
      
      if (companyExists) {
        validCompanyId = companyId;
      } else {
        console.log(`Skipping contact: Company with ID ${item.companyId} does not exist`);
        skipped++;
        continue; // Skip this contact
      }
    }

    const mappedItem = {
      name: item.name,
      email: email,
      phone: item.phone || '',
      companyId: validCompanyId,
      status: mapContactStatus(item.status),
      userId: user.sub,
    };

    try {
      const existing = await this.prisma.contact.findUnique({ 
        where: { 
          email_userId: {
            email: mappedItem.email,
            userId: user.sub,
          }
        } 
      });

      if (!existing) {
        await this.prisma.contact.create({ data: mappedItem });
        added++;
      } else {
        let isDifferent = false;
        if (mappedItem.name && mappedItem.name !== existing.name) isDifferent = true;
        if (mappedItem.phone && mappedItem.phone !== existing.phone) isDifferent = true;
        if (mappedItem.companyId !== existing.companyId) isDifferent = true;
        if (mappedItem.status !== existing.status) isDifferent = true;

        if (isDifferent) {
          await this.prisma.contact.update({
            where: { id: existing.id },
            data: mappedItem,
          });
          updated++;
        } else {
          unchanged++;
        }
      }
    } catch (error) {
      console.error(`Error processing contact ${email}:`, error.message);
      skipped++;
    }
  }
  
  return { added, updated, unchanged, skipped };
}
}
