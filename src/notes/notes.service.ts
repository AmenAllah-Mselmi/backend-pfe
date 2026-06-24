import { Injectable } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotesService {
  constructor(private readonly prisma: PrismaService) { }
  async create(createNoteDto: CreateNoteDto) {
    const lead = await this.prisma.lead.findUnique({
      where: { id: createNoteDto.leadId }
    });
    if (!lead) {
      throw new Error(`Lead with id ${createNoteDto.leadId} not found`);
    }
    const user = await this.prisma.user.findUnique({
      where: { id: createNoteDto.userId }
    });
    if (!user) {
      throw new Error(`User with id ${createNoteDto.userId} not found`);
    }
    const note = await this.prisma.note.create({
      data: createNoteDto,
      include: { user: true }
    });

    await this.prisma.activity.create({
      data: {
        type: 'note_added',
        title: 'Note Added',
        description: `Note added for Lead: ${lead.name}`,
        entity: 'lead',
        entityId: lead.id,
        userId: createNoteDto.userId,
        metadata: { entityName: lead.name }
      }
    });

    return note;
  }

  async findAll() {
    return await this.prisma.note.findMany({
      include: { user: true }
    });
  }

  async findOne(id: number) {
    const note = await this.prisma.note.findUnique({
      where: { id }
    });
    if (!note) {
      throw new Error(`Note with id ${id} not found`);
    }
    return note;
  }

  async update(id: number, updateNoteDto: UpdateNoteDto) {
    const existingNote = await this.prisma.note.findUnique({
      where: { id }
    });
    if (!existingNote) {
      throw new Error(`Note with id ${id} not found`);
    }
    if (updateNoteDto.leadId) {
      const lead = await this.prisma.lead.findUnique({
        where: { id: updateNoteDto.leadId }
      });
      if (!lead) {
        throw new Error(`Lead with id ${updateNoteDto.leadId} not found`);
      }
    }

    if (updateNoteDto.userId) {
      const user = await this.prisma.user.findUnique({
        where: { id: updateNoteDto.userId }
      });
      if (!user) {
        throw new Error(`User with id ${updateNoteDto.userId} not found`);
      }
    }
    return await this.prisma.note.update({
      where: { id },
      data: updateNoteDto
    });
  }

  async remove(id: number) {
    const note = await this.prisma.note.findUnique({
      where: { id }
    });
    if (!note) {
      throw new Error(`Note with id ${id} not found`);
    }
    return await this.prisma.note.delete({
      where: { id }
    });
  }
}
