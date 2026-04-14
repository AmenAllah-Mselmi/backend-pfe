import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class TasksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService
  ) {}
  async create(createTaskDto: CreateTaskDto) {
    const lead = await this.prisma.lead.findUnique({
      where: { id: createTaskDto.leadId },
    });
    if (!lead) {
      throw new Error(`Lead with id ${createTaskDto.leadId} not found`);
    }
    const user = await this.prisma.user.findUnique({
      where: { id: createTaskDto.userId },
    });
    if (!user) {
      throw new Error(`User with id ${createTaskDto.userId} not found`);
    }
    const task = await this.prisma.task.create({
      data: createTaskDto,
    });

    await this.notificationsService.create({
      userId: task.userId,
      type: 'TASK',
      message: `A new task "${task.title}" has been assigned to you.`,
      degree: task.priority,
      relatedId: task.id
    });

    return task;
  }

 async  findAll() {
    return await this.prisma.task.findMany();
  }

 async  findOne(id: number) {
  const task = await this.prisma.task.findUnique({
      where: { id },
    });
    if (!task) {
      throw new Error(`Task with id ${id} not found`);
    }
    return task;
  }

 async  update(id: number, updateTaskDto: UpdateTaskDto) {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });
    if (!task) {
      throw new Error(`Task with id ${id} not found`);
    }
    if (updateTaskDto.leadId) {
      const lead = await this.prisma.lead.findUnique({
        where: { id: updateTaskDto.leadId },
      }); 
      if (!lead) {
        throw new Error(`Lead with id ${updateTaskDto.leadId} not found`);
      }
    }
    if (updateTaskDto.userId) {
      const user = await this.prisma.user.findUnique({
        where: { id: updateTaskDto.userId },
      });
      if (!user) {
        throw new Error(`User with id ${updateTaskDto.userId} not found`);
      }
    }
    return await this.prisma.task.update({
      where: { id },
      data: updateTaskDto,
    });
  }

 async  remove(id: number) {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });
    if (!task) {
      throw new Error(`Task with id ${id} not found`);
    }
    return await this.prisma.task.delete({
      where: { id },
    });
  }
}
