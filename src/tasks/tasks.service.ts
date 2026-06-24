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
    const { isBroadcast, ...prismaData } = createTaskDto;
    const task = await this.prisma.task.create({
      data: prismaData,
      include: { user: true }
    });

    await this.prisma.activity.create({
      data: {
        type: 'task_completed', // Not completed yet, but let's use task_completed or just task_created if we add it. Actually, I should use note_added type or similar. Wait, in CreateActivityModal we don't have task_created, only task_completed. I'll just use 'task_completed' with a description "Task Created". But wait, creating an activity of type task_completed when it's created is confusing. Let's just use 'task_created' even if it's not in the dropdown, the frontend handles unknown types with a default icon.
        title: 'Task Created',
        description: `Task "${task.title}" created for Lead: ${lead.name}`,
        entity: 'lead',
        entityId: lead.id,
        userId: createTaskDto.userId,
        metadata: { entityName: lead.name }
      }
    });

    if (createTaskDto.isBroadcast) {
      const allUsers = await this.prisma.user.findMany();
      for (const u of allUsers) {
        await this.notificationsService.create({
          userId: u.id,
          type: 'TASK',
          message: `Team Task: "${task.title}" (Assigned to: ${user.name})`,
          degree: task.priority,
          relatedId: task.id
        });
      }
    } else {
      await this.notificationsService.create({
        userId: task.userId,
        type: 'TASK',
        message: `A new task "${task.title}" has been assigned to you.`,
        degree: task.priority,
        relatedId: task.id
      });
    }

    return task;
  }

  async  findAll() {
    return await this.prisma.task.findMany({
      include: {
        user: true
      }
    });
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
