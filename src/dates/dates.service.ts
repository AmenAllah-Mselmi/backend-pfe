import { Injectable } from '@nestjs/common';
import { CreateDateDto } from './dto/create-date.dto';
import { UpdateDateDto } from './dto/update-date.dto';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class DatesService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createDateDto: CreateDateDto) {
    return await  this.prisma.date.create({
      data: { ...createDateDto },
    });
  }

 async  findAll() {
    return await this.prisma.date.findMany()
    ;
  }

  async findOne(id: number) {
const date = await this.prisma.date.findUnique({
  where: { id },
});
if(!date) {
  throw new Error(`Date with id ${id} not found`);
}
return date;
  }

  async update(id: number, updateDateDto: UpdateDateDto) {
    const date = await this.prisma.date.findUnique({
      where: { id },
    });
    if (!date) {
      throw new Error(`Date with id ${id} not found`);
    }
    return await this.prisma.date.update({
      where: { id },
      data: { ...updateDateDto },
    });
  }

  async remove(id: number) {
    const date = await this.prisma.date.findUnique({
      where: { id },
    });
    if (!date) {
      throw new Error(`Date with id ${id} not found`);
    }
    return await this.prisma.date.delete({
      where: { id },
    });
  }
}
