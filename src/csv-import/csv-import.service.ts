import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as csv from 'csv-parser';
import { Readable } from 'stream';

@Injectable()
export class CsvImportService {
  constructor(private readonly prisma: PrismaService) {}

  async uploadCsv(file: Express.Multer.File, userId: number) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const results: any[] = [];
    const stream = Readable.from(file.buffer);

    return new Promise((resolve, reject) => {
      stream
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
          try {
            let importedCount = 0;
            // Iterate over results and insert into Leads
            for (const row of results) {
              if (row.name && row.email && row.phone) {
                // Check if lead already exists
                const existingLead = await this.prisma.lead.findFirst({
                  where: { email: row.email, userId: userId },
                });

                if (!existingLead) {
                  await this.prisma.lead.create({
                    data: {
                      name: row.name,
                      email: row.email,
                      phone: row.phone,
                      userId: userId,
                    },
                  });
                  importedCount++;
                }
              }
            }

            // Create CsvImport record
            const csvImport = await this.prisma.csvImport.create({
              data: {
                fileName: file.originalname,
                status: 'COMPLETED',
                numberOfRows: importedCount,
                userId: userId,
              },
            });

            resolve({
              message: 'CSV file processed successfully',
              importedRows: importedCount,
              totalRows: results.length,
              importRecord: csvImport,
            });
          } catch (error) {
            reject(new BadRequestException('Error processing CSV data: ' + error.message));
          }
        })
        .on('error', (error) => {
          reject(new BadRequestException('Error parsing CSV file: ' + error.message));
        });
    });
  }

  async findAll() {
    return await this.prisma.csvImport.findMany();
  }

  async findOne(id: number) {
    const csvImport = await this.prisma.csvImport.findUnique({
      where: { id },
    });
    if (!csvImport) {
      throw new BadRequestException(`CsvImport with id ${id} not found`);
    }
    return csvImport;
  }

  async remove(id: number) {
    const csvImport = await this.prisma.csvImport.findUnique({
      where: { id },
    });
    if (!csvImport) {
      throw new BadRequestException(`CsvImport with id ${id} not found`);
    }
    return await this.prisma.csvImport.delete({
      where: { id },
    });
  }
}
