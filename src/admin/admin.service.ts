import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ManagerService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });
    if (existingUser) throw new BadRequestException('Email already registered');

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const { managerId, ...rest } = createUserDto;

    const user = await this.prisma.user.create({
      data: {
        ...rest,
        password: hashedPassword,
        ...(managerId ? { managerId } : {}),
      },
    });

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async findAll(currentUser: any) {
    return await this.prisma.user.findMany({
      where: {
        managerId: currentUser.sub,
        role: 'REP',
      },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new BadRequestException(`User with id ${id} not found`);
    }
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async remove(id: number) {
    const user = await this.prisma.user.delete({ where: { id } });
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
