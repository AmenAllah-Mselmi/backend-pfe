import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChatDto } from './dto/create-chat.dto';

@Injectable()
export class ChatsService {
  constructor(private prisma: PrismaService) {}

  async create(createChatDto: CreateChatDto) {
    if (!createChatDto.isGroup && createChatDto.userIds.length === 2) {
      // Check if 1-on-1 chat already exists
      const existingChats = await this.prisma.chat.findMany({
        where: {
          isGroup: false,
          users: {
            every: {
              id: { in: createChatDto.userIds }
            }
          }
        },
        include: { users: true }
      });
      const exactMatch = existingChats.find(chat => chat.users.length === 2);
      if (exactMatch) return exactMatch;
    }

    return this.prisma.chat.create({
      data: {
        name: createChatDto.name,
        isGroup: createChatDto.isGroup || false,
        users: {
          connect: createChatDto.userIds.map(id => ({ id }))
        }
      },
      include: { users: true }
    });
  }

  findAll(userId: number) {
    return this.prisma.chat.findMany({
      where: {
        users: { some: { id: userId } }
      },
      include: {
        users: {
          select: { id: true, name: true, role: true, company: true }
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { updatedAt: 'desc' }
    });
  }

  async findOne(id: string) {
    const chat = await this.prisma.chat.findUnique({
      where: { id },
      include: {
        users: { select: { id: true, name: true, role: true } },
        messages: {
          orderBy: { createdAt: 'asc' },
          include: { sender: { select: { id: true, name: true, role: true } } }
        }
      }
    });
    if (!chat) throw new NotFoundException('Chat not found');
    return chat;
  }

  async findOrCreateGlobal(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true, managerId: true }
    });

    if (!user) throw new NotFoundException('User not found');

    // The team manager is the user if they are admin/parent, otherwise their manager
    const teamManagerId = (user.role === 'ADMIN' || !user.managerId) ? user.id : user.managerId;
    const teamChatName = `Team Chat_${teamManagerId}`;

    // Find the shared team group chat
    const existing = await this.prisma.chat.findFirst({
      where: { isGroup: true, name: teamChatName },
      include: {
        users: { select: { id: true, name: true, role: true } },
        messages: {
          orderBy: { createdAt: 'asc' },
          include: { sender: { select: { id: true, name: true, role: true } } }
        }
      }
    });

    if (existing) {
      // If user is not yet a member, add them
      const isMember = existing.users.some(u => u.id === userId);
      if (!isMember) {
        return this.prisma.chat.update({
          where: { id: existing.id },
          data: { users: { connect: { id: userId } } },
          include: {
            users: { select: { id: true, name: true, role: true } },
            messages: {
              orderBy: { createdAt: 'asc' },
              include: { sender: { select: { id: true, name: true, role: true } } }
            }
          }
        });
      }
      return existing;
    }

    // Create team chat for the first time with this user
    return this.prisma.chat.create({
      data: {
        name: teamChatName,
        isGroup: true,
        users: { connect: { id: userId } }
      },
      include: {
        users: { select: { id: true, name: true, role: true } },
        messages: {
          orderBy: { createdAt: 'asc' },
          include: { sender: { select: { id: true, name: true, role: true } } }
        }
      }
    });
  }
}
