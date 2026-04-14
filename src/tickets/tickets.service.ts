import { Injectable } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class TicketsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly notificationsService: NotificationsService
  ) { }
  async create(createTicketDto: CreateTicketDto, currentUser: any) {
    const lead = await this.prismaService.lead.findUnique({
      where: { id: createTicketDto.leadId },
    });
    if (!lead) {
      throw new Error(`Lead with id ${createTicketDto.leadId} not found`);
    }
    const contact = await this.prismaService.contact.findUnique({
      where: { id: createTicketDto.contactId },
    });
    if (!contact) {
      throw new Error(`Contact with id ${createTicketDto.contactId} not found`);
    }
    const user = await this.prismaService.user.findUnique({
      where: { id: currentUser.sub },
    });
    if (!user) {
      throw new Error(`User with id ${currentUser.sub} not found`);
    }
    const ticket = await this.prismaService.ticket.create({
      data: { ...createTicketDto, userId: currentUser.sub },
    });

    await this.notificationsService.create({
      userId: currentUser.sub, // send it to the creator or assigned user
      type: 'TICKET',
      message: `Ticket "${ticket.title}" has been added.`,
      degree: ticket.priority,
      relatedId: ticket.id
    });

    return ticket;
  }

  async findAll(currentUser: any) {
    const whereClause = currentUser.role === 'ADMIN'
      ? { OR: [{ userId: currentUser.sub }, { user: { managerId: currentUser.sub } }] }
      : { userId: currentUser.sub };

    return await this.prismaService.ticket.findMany({
      where: whereClause
    });
  }

  async findOne(id: number) {
    const ticket = await this.prismaService.ticket.findUnique({
      where: { id },
    });
    if (!ticket) {
      throw new Error(`Ticket with id ${id} not found`);
    }
    return ticket;
  }

  async update(id: number, updateTicketDto: UpdateTicketDto) {
    const ticket = await this.prismaService.ticket.findUnique({
      where: { id },
    });
    if (!ticket) {
      throw new Error(`Ticket with id ${id} not found`);
    }

    // Only validate relations that are actually being updated
    if (updateTicketDto.leadId !== undefined) {
      const lead = await this.prismaService.lead.findUnique({
        where: { id: updateTicketDto.leadId },
      });
      if (!lead) {
        throw new Error(`Lead with id ${updateTicketDto.leadId} not found`);
      }
    }

    if (updateTicketDto.contactId !== undefined) {
      const contact = await this.prismaService.contact.findUnique({
        where: { id: updateTicketDto.contactId },
      });
      if (!contact) {
        throw new Error(`Contact with id ${updateTicketDto.contactId} not found`);
      }
    }

    if (updateTicketDto.userId !== undefined) {
      const user = await this.prismaService.user.findUnique({
        where: { id: updateTicketDto.userId },
      });
      if (!user) {
        throw new Error(`User with id ${updateTicketDto.userId} not found`);
      }
    }

    return await this.prismaService.ticket.update({
      where: { id },
      data: updateTicketDto,
    });
  }

  async remove(id: number) {
    const ticket = await this.prismaService.ticket.findUnique({
      where: { id },
    });
    if (!ticket) {
      throw new Error(`Ticket with id ${id} not found`);
    }
    return await this.prismaService.ticket.delete({
      where: { id },
    });
  }
}
