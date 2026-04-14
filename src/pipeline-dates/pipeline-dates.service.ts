import { Injectable } from '@nestjs/common';
import { CreatePipelineDateDto } from './dto/create-pipeline-date.dto';
import { UpdatePipelineDateDto } from './dto/update-pipeline-date.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PipelineDatesService {
  constructor(private readonly prisma: PrismaService) {}  
  async create(createPipelineDateDto: CreatePipelineDateDto) {
    const pipeline= await this.prisma.pipeline.findUnique({
      where:{id:createPipelineDateDto.pipelineId}
    });
    if(!pipeline){
      throw new Error(`Pipeline with id ${createPipelineDateDto.pipelineId} not found`);
    }
    const date= await this.prisma.date.findUnique({
      where:{id:createPipelineDateDto.dateId}
    });
    if(!date){
      throw new Error(`Date with id ${createPipelineDateDto.dateId} not found`);
    }
    return await this.prisma.pipelineDate.create({
      data: createPipelineDateDto
    });
  }

 async  findAll() {
    return await this.prisma.pipelineDate.findMany();
  }

  async findOne(dateId: number, pipelineId: number) {
    const pipelineDate = await this.prisma.pipelineDate.findUnique({
      where: { 
        dateId_pipelineId: {
          dateId: dateId,
          pipelineId: pipelineId
        }
       }
    });
    if (!pipelineDate) {
      throw new Error(`PipelineDate with dateId ${dateId} and pipelineId ${pipelineId} not found`);
    }
    return pipelineDate;
  }

 async  update(dateId: number, pipelineId: number, updatePipelineDateDto: UpdatePipelineDateDto) {
    const pipelineDate = await this.prisma.pipelineDate.findUnique({
      where: { 
        dateId_pipelineId: {
          dateId: dateId,
          pipelineId: pipelineId
        }
       }
    });
    if (!pipelineDate) {
      throw new Error(`PipelineDate with dateId ${dateId} and pipelineId ${pipelineId} not found`);
    }
    return await this.prisma.pipelineDate.update({
      where: { 
        dateId_pipelineId: {    
          dateId: dateId,
          pipelineId: pipelineId
        }
  },
      data: updatePipelineDateDto
    });
  }

  async remove(dateId: number, pipelineId: number) {
    const pipelineDate = await this.prisma.pipelineDate.findUnique({
      where: { 
        dateId_pipelineId: {
          dateId: dateId,
          pipelineId: pipelineId
        }
       }
    });
    if (!pipelineDate) {
      throw new Error(`PipelineDate with dateId ${dateId} and pipelineId ${pipelineId} not found`);
    }
    return await this.prisma.pipelineDate.delete({
      where: { 
        dateId_pipelineId: {    
          dateId: dateId,
          pipelineId: pipelineId
        }
  }
    });
  }
}
