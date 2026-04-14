import { Injectable } from '@nestjs/common';
import { CreateLeadScoreDto } from './dto/create-lead-score.dto';
import { UpdateLeadScoreDto } from './dto/update-lead-score.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LeadScoresService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createLeadScoreDto: CreateLeadScoreDto) {
    const lead = await this.prisma.lead.findUnique({
      where: { id: createLeadScoreDto.leadId },
    });
    if (!lead) {
      throw new Error(`Lead with id ${createLeadScoreDto.leadId} not found`);
    }
    return await this.prisma.leadScore.create({
      data: createLeadScoreDto,
    });
  }

  async findAll() {
    return await this.prisma.leadScore.findMany();
  }

  async findOne(id: number) {
    const leadScore = await this.prisma.leadScore.findUnique({
      where: { id },
    });
    if (!leadScore) {
      throw new Error(`LeadScore with id ${id} not found`);
    }
    return leadScore;
  }

 async  update(id: number, updateLeadScoreDto: UpdateLeadScoreDto) {
    const leadScore = await this.prisma.leadScore.findUnique({
      where: { id },
    });
    if (!leadScore) {
      throw new Error(`LeadScore with id ${id} not found`);
    }
    const lead = await this.prisma.lead.findUnique({
      where: { id: updateLeadScoreDto.leadId },
    });
    if (!lead) {
      throw new Error(`Lead with id ${updateLeadScoreDto.leadId} not found`);
    }
    return await this.prisma.leadScore.update({
      where: { id },
      data: updateLeadScoreDto,
    });
  }

 async  remove(id: number) {
    const leadScore = await this.prisma.leadScore.findUnique({
      where: { id },
    });
    if (!leadScore) {
      throw new Error(`LeadScore with id ${id} not found`);
    }
    return await this.prisma.leadScore.delete({
      where: { id },
    });
  }
}
