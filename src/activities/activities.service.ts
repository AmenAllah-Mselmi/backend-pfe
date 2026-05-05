import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ActivitiesService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createActivityDto: CreateActivityDto, currentUser: any) {
    const { userId, ...rest } = createActivityDto;

    // Check if user exists
    const user = await this.prisma.user.findUnique({ where: { id: currentUser.sub } });
    if (!user) {
      throw new NotFoundException(`User with id ${currentUser.sub} not found`);
    }

    return await this.prisma.activity.create({
      data: {
        ...rest,
        user: {
          connect: { id: currentUser.sub },
        },
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          }
        }
      }
    });
  }

  async findAll(currentUser: any, options?: { page?: number; limit?: number }) {
    const { page = 1, limit = 10 } = options || {};
    const skip = (page - 1) * limit;

    const whereClause = currentUser.role === 'ADMIN'
      ? { OR: [{ userId: currentUser.sub }, { user: { managerId: currentUser.sub } }] }
      : { userId: currentUser.sub };

    const [activities, total] = await Promise.all([
      this.prisma.activity.findMany({
        where: whereClause,
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit,
        include: {
          user: {
            select: {
              name: true,
              email: true,
            }
          }
        }
      }),
      this.prisma.activity.count({ where: whereClause })
    ]);

    // Format activities for the frontend
    const formattedData = activities.map(a => this.formatActivity(a));

    return {
      data: formattedData,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async findOne(id: number) {
    const activity = await this.prisma.activity.findUnique({
      where: { id: id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          }
        }
      }
    });

    if (!activity) {
      throw new NotFoundException(`Activity with id ${id} not found`);
    }

    return this.formatActivity(activity);
  }

  async update(id: number, updateActivityDto: UpdateActivityDto) {
    const activity = await this.prisma.activity.findUnique({
      where: { id: id },
    });

    if (!activity) {
      throw new NotFoundException(`Activity with id ${id} not found`);
    }

    const updated = await this.prisma.activity.update({
      where: { id: id },
      data: updateActivityDto,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          }
        }
      }
    });

    return this.formatActivity(updated);
  }

  async remove(id: number) {
    const activity = await this.prisma.activity.findUnique({
      where: { id: id },
    });

    if (!activity) {
      throw new NotFoundException(`Activity with id ${id} not found`);
    }

    return await this.prisma.activity.delete({
      where: { id: id },
    });
  }

  // Helper to format the activity to match frontend expectations
  private formatActivity(activity: any) {
    let avatar = '??';
    if (activity.user && activity.user.name) {
      avatar = activity.user.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
    }

    // Determine the timestamp (prefer createdAt)
    const timestamp = activity.createdAt ? activity.createdAt.toISOString() : new Date().toISOString();

    return {
      ...activity,
      timestamp, // Add explicit timestamp field
      user: {
        name: activity.user?.name || 'Unknown',
        email: activity.user?.email,
        avatar
      }
    };
  }
}
