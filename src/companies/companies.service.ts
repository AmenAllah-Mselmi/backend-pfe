import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as fs from 'fs';
import csvParser = require('csv-parser');
import { Prisma, CompanyIndustry, CompanySize } from '@prisma/client';

@Injectable()
export class CompaniesService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createCompanyDto: CreateCompanyDto, user: any) {
    console.log('received dto', createCompanyDto);
    const data: any = { ...createCompanyDto, userId: user.sub };
    return await this.prisma.company.create({
      data,
    });
  }

  async findAll(user: any, options?: { page?: number; limit?: number; search?: string }) {
    const { page = 1, limit = 10, search } = options || {};
    const skip = (page - 1) * limit;

    const baseWhere: any = user.role === 'ADMIN'
      ? { OR: [{ userId: user.sub }, { user: { managerId: user.sub } }] }
      : { userId: user.sub };

    const whereClause = search
      ? { AND: [baseWhere, { name: { contains: search } }] }
      : baseWhere;

    const [data, total] = await Promise.all([
      this.prisma.company.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { contacts: true },
      }),
      this.prisma.company.count({ where: whereClause })
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
    const company = await this.prisma.company.findUnique({
      where: { id },
    });
    if (!company) {
      throw new Error(`Company with id ${id} not found`);
    }
    return company;
  }

  async update(id: number, updateCompanyDto: UpdateCompanyDto) {
    const company = await this.prisma.company.findUnique({
      where: { id },
    });
    if (!company) {
      throw new Error(`Company with id ${id} not found`);
    }
    return await this.prisma.company.update({
      where: { id },
      data: updateCompanyDto,
    });
  }

  async remove(id: number) {
    const company = await this.prisma.company.findUnique({
      where: { id },
    });
    if (!company) {
      throw new Error(`Company with id ${id} not found`);
    }
    return await this.prisma.company.delete({
      where: { id },
    });
  }
  async importCsv(filePath: string) {
    const batchSize = 1000;
    let batch: Prisma.CompanyCreateManyInput[] = [];
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

          let nameValue = normalized['name'] || normalized['companyname'] || normalized['company name'];
          const item: any = {
            name: nameValue,
            email: normalized['email'],
            phone: normalized['phone'],
            companyIndustry: normalized['companyindustry'] || normalized['industry'],
            companySize: normalized['companysize'] || normalized['size'],
            location: normalized['location'],
          };

          Object.keys(item).forEach(key => {
            if (item[key] === undefined || item[key] === '') delete item[key];
          });

          // fallback: derive company name from email local-part if email provided
          if (!item.name && item.email) {
            item.name = String(item.email).split('@')[0];
            derived++;
          }

          if (!item.name) { skipped++; return; }

          batch.push(item as Prisma.CompanyCreateManyInput);

          if (batch.length >= batchSize) {
            try {
              await this.prisma.company.createMany({ data: batch });
              inserted += batch.length;
              batch = [];
            } catch (err) {
              reject(err);
            }
          }
        })
        .on('end', async () => {
          if (batch.length > 0) {
            await this.prisma.company.createMany({ data: batch });
            inserted += batch.length;
          }
          resolve({ inserted, parsed, skipped, derived });
        })
        .on('error', reject);
    });
  }

  async importBulk(data: any[], user: any) {
    const mapIndustry = (val: any): CompanyIndustry => {
      if (!val) return CompanyIndustry.OTHER;
      const s = String(val).toUpperCase().trim();
      if (s.includes('TECH')) return CompanyIndustry.TECHNOLOGY;
      if (s.includes('FINANCE') || s.includes('BANK')) return CompanyIndustry.FINANCE;
      if (s.includes('HEALTH') || s.includes('MED')) return CompanyIndustry.HEALTHCARE;
      if (s.includes('EDU')) return CompanyIndustry.EDUCATION;
      return CompanyIndustry.OTHER;
    };

    const mapSize = (val: any): CompanySize => {
      if (!val) return CompanySize.SMALL;
      const s = String(val).toUpperCase().trim();
      if (s.includes('LARGE') || s.includes('ENTERPRISE') || s.includes('BIG')) return CompanySize.LARGE;
      if (s.includes('MEDIUM') || s.includes('MID')) return CompanySize.MEDIUM;
      return CompanySize.SMALL;
    };

    let added = 0;
    let updated = 0;
    let unchanged = 0;

    for (const item of data) {
      if (!item.name && !item.email) continue;
      const email = item.email || `${item.name.replace(/\s+/g, '').toLowerCase()}@example.com`;

      const mappedItem = {
        name: item.name,
        email: email,
        phone: item.phone || '',
        companyIndustry: mapIndustry(item.industry || item.companyIndustry),
        companySize: mapSize(item.size || item.companySize),
        location: item.location || 'Unknown',
        userId: user.sub,
      };

      const existing = await this.prisma.company.findUnique({ where: { 
        email_userId: {
          email: mappedItem.email,
          userId: user.sub,
        }
       } });

      if (!existing) {
        await this.prisma.company.create({ data: mappedItem });
        added++;
      } else {
        let isDifferent = false;
        if (mappedItem.name && mappedItem.name !== existing.name) isDifferent = true;
        if (mappedItem.phone && mappedItem.phone !== existing.phone) isDifferent = true;
        if (mappedItem.companyIndustry !== existing.companyIndustry) isDifferent = true;
        if (mappedItem.companySize !== existing.companySize) isDifferent = true;
        if (mappedItem.location !== existing.location) isDifferent = true;

        if (isDifferent) {
          await this.prisma.company.update({
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
