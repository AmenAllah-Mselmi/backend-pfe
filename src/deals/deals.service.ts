import { Injectable } from '@nestjs/common';
import { CreateDealDto } from './dto/create-deal.dto';
import { UpdateDealDto } from './dto/update-deal.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DealsService {
  constructor (private readonly prisma: PrismaService) {}
  async create(createDealDto: CreateDealDto, user: any) {
    const { leadId, pipelineId, ...dealFields } = createDealDto;
    
    const lead = await this.prisma.lead.findUnique({
      where: { id: leadId },
    });
    
    if (!lead) {
      throw new Error(`Lead with id ${leadId} not found`);
    }

    // If a pipelineId is provided, update the lead to belong to that pipeline
    if (pipelineId) {
      await this.prisma.lead.update({
        where: { id: leadId },
        data: { pipelineId },
      });
    }

    return await this.prisma.deal.create({
      data: { 
        ...dealFields,
        pipelineId,
        leadId: lead.id, 
        userId: user.sub 
      }
    });
  }

  async findAll(user: any) {
    const whereClause = user.role === 'ADMIN'
      ? { OR: [{ userId: user.sub }, { user: { managerId: user.sub } }] }
      : { userId: user.sub };

    return await this.prisma.deal.findMany({
      where: whereClause
    });
  }

  async findOne(id: number) {
    const deal = await this.prisma.deal.findUnique({
      where: { id },
    });
    if (!deal) {
      throw new Error(`Deal with id ${id} not found`);
    }
    return deal;
  }

  async update(id: number, updateDealDto: UpdateDealDto) {
    const deal = await this.prisma.deal.findUnique({
      where: { id },
    });
    if (!deal) {
      throw new Error(`Deal with id ${id} not found`);
    }
    return await this.prisma.deal.update({
      where: { id },
      data: updateDealDto,
    });
  }

  async remove(id: number) {
    const deal = await this.prisma.deal.findUnique({
      where: { id },
    });
    if (!deal) {
      throw new Error(`Deal with id ${id} not found`);
    }
    return await this.prisma.deal.delete({
      where: { id },
    });
  }
}
