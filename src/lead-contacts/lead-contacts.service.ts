import { Injectable } from '@nestjs/common';
import { CreateLeadContactDto } from './dto/create-lead-contact.dto';
import { UpdateLeadContactDto } from './dto/update-lead-contact.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LeadContactsService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createLeadContactDto: CreateLeadContactDto) {
    const contact= await this.prisma.contact.findUnique({
      where:{id:createLeadContactDto.contactId}
    });
    if(!contact){
      throw new Error(`Contact with id ${createLeadContactDto.contactId} not found`);
    }
    const lead= await this.prisma.lead.findUnique({
      where:{id:createLeadContactDto.leadId}
    });
    if(!lead){
      throw new Error(`Lead with id ${createLeadContactDto.leadId} not found`);
    }
    return await this.prisma.leadContact.create({
      data: createLeadContactDto
    });
  }

  async findAll() {
    return await this.prisma.leadContact.findMany();
  }

  async findOne(id: number) {
    const leadContact = await this.prisma.leadContact.findUnique({
      where: { id }
    });
    if (!leadContact) {
      throw new Error(`LeadContact with id ${id} not found`);
    }
    return leadContact;
  }

  async update(id: number, updateLeadContactDto: UpdateLeadContactDto) {
    const leadContact = await this.prisma.leadContact.findUnique({
      where: { id }
    });
    if (!leadContact) {
      throw new Error(`LeadContact with id ${id} not found`);
    }
    return await this.prisma.leadContact.update({
      where: { id },
      data: updateLeadContactDto
    });
  }

  async remove(id: number) {
    const leadContact = await this.prisma.leadContact.findUnique({
      where: { id }
    });
    if (!leadContact) {
      throw new Error(`LeadContact with id ${id} not found`);
    }
    return await this.prisma.leadContact.delete({
      where: { id }
    });
  }
}
