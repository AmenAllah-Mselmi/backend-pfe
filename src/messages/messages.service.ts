import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async create(senderId: number, createMessageDto: CreateMessageDto) {
    const message = await this.prisma.message.create({
      data: {
        content: createMessageDto.content,
        chatId: createMessageDto.chatId,
        senderId,
        receiverId: createMessageDto.receiverId,
      },
      include: {
        sender: { select: { id: true, name: true, role: true } }
      }
    });

    await this.prisma.chat.update({
      where: { id: createMessageDto.chatId },
      data: { updatedAt: new Date() }
    });

    return message;
  }

  findAllByChat(chatId: string) {
    return this.prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: 'asc' },
      include: { sender: { select: { id: true, name: true, role: true } } }
    });
  }
}
