import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async create(data: { userId: number; type: string; message: string; degree?: any; relatedId?: number }) {
    return this.prisma.notification.create({
      data: {
        userId: data.userId,
        type: data.type,
        message: data.message,
        degree: data.degree || 'MEDIUM',
        relatedId: data.relatedId,
      }
    });
  }

  findByUser(userId: number) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  markAsRead(id: number) {
    return this.prisma.notification.update({
      where: { id },
      data: { isRead: true }
    });
  }
}
