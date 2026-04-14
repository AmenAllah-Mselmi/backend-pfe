import { Injectable } from '@nestjs/common';
import { CreateCsvImportDto } from './dto/create-csv-import.dto';
import { UpdateCsvImportDto } from './dto/update-csv-import.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CsvImportService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createCsvImportDto: CreateCsvImportDto) {
const  { userId,...rest} = createCsvImportDto
const user= await this.prisma.user.findUnique({
  where:{id:userId}
})
if(!user){
  throw new Error(`User with id ${userId} not found`);
}
    return await this.prisma.csvImport.create({
      data: { ...rest, user: { connect: { id: userId } } }
    });
  }

 async  findAll() {
    return await this.prisma.csvImport.findMany();
  }

   async findOne(id: number) {
    const csvImport = await this.prisma.csvImport.findUnique({
      where: { id },
    });
    if (!csvImport) {
      throw new Error(`CsvImport with id ${id} not found`);
    }
    return csvImport;
  }

  async update(id: number, updateCsvImportDto: UpdateCsvImportDto) {
    const csvImport = await this.prisma.csvImport.findUnique({
      where: { id },
    });
    if (!csvImport) {
      throw new Error(`CsvImport with id ${id} not found`);
    }
    return await this.prisma.csvImport.update({
      where: { id },
      data: updateCsvImportDto,
    });
  }

  async remove(id: number) {
    const csvImport = await this.prisma.csvImport.findUnique({
      where: { id },
    });
    if (!csvImport) {
      throw new Error(`CsvImport with id ${id} not found`);
    }
    return await this.prisma.csvImport.delete({
      where: { id },
    });
  }
}
