import { Injectable } from '@nestjs/common';
import { CreatePipelineDto } from './dto/create-pipeline.dto';
import { UpdatePipelineDto } from './dto/update-pipeline.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PipelinesService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createPipelineDto: CreatePipelineDto, user: any) {
    return await this.prisma.pipeline.create({
      data: { ...createPipelineDto, userId: user.sub }
    });
  }

  async findAll(user: any) {
    const whereClause = user.role === 'ADMIN'
      ? { OR: [{ userId: user.sub }, { user: { managerId: user.sub } }] }
      : { userId: user.sub };

    return await this.prisma.pipeline.findMany({
      where: whereClause
    });
  }

  async findOne(id: number) {
    const pipeline = await this.prisma.pipeline.findUnique({
      where: { id },
    });
    if (!pipeline) {
      throw new Error(`Pipeline with id ${id} not found`);
    }
    return pipeline;
  }

  async update(id: number, updatePipelineDto: UpdatePipelineDto) {
    const pipeline = await this.prisma.pipeline.findUnique({
      where: { id },
    });
    if (!pipeline) {
      throw new Error(`Pipeline with id ${id} not found`);
    }
    return await this.prisma.pipeline.update({
      where: { id },
      data: updatePipelineDto,
    });
  }

  async remove(id: number) {
    const pipeline = await this.prisma.pipeline.findUnique({
      where: { id },
    });
    if (!pipeline) {
      throw new Error(`Pipeline with id ${id} not found`);
    }
    return await this.prisma.pipeline.delete({
      where: { id },
    });
  }
}
