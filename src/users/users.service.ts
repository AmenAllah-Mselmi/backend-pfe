import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
  ) { }
  async create(createUserDto: CreateUserDto, response?: Response) {
    // 1️⃣ Check if email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    // 2️⃣ Hash password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // 3️⃣ Create user
    const { managerId, ...rest } = createUserDto;
    const user = await this.prisma.user.create({
      data: {
        ...rest,
        password: hashedPassword,
        ...(managerId ? { managerId } : {}),
      },
    });

    // 4️⃣ Generate token
    const payload = { sub: user.id, email: user.email,role:user.role };
    const { password: _, ...userWithoutPassword } = user;

    const token = this.jwtService.sign(payload);

    if (response) {
      const isProduction = process.env.NODE_ENV === 'production';
      response.cookie('token', token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'strict' : 'lax',
        maxAge: 24 * 60 * 60 * 1000,
      });
      response.cookie('isAuthenticated', 'true', {
        httpOnly: false,
        secure: isProduction,
        sameSite: isProduction ? 'strict' : 'lax',
        maxAge: 24 * 60 * 60 * 1000,
      });
      response.cookie('userRole', user.role, {
        httpOnly: false,
        secure: isProduction,
        sameSite: isProduction ? 'strict' : 'lax',
        maxAge: 24 * 60 * 60 * 1000,
      });
    }

    return {
      message: 'User registered successfully',
      user: userWithoutPassword,
      access_token: token,
    };
  }
  async findAll(currentUser: any) {
    if (currentUser?.role === 'ADMIN') {
      return await this.prisma.user.findMany({
        where: {
          OR: [
            { id: currentUser.sub },
            { managerId: currentUser.sub }
          ]
        }
      });
    }
    const user=await this.prisma.user.findUnique({
      where:{id:currentUser.sub}
    })
    if(!user) throw new Error('User not found')
    // REP only sees themselves
    return await this.prisma.user.findMany({
      where: {
        OR:[
          { managerId: user.managerId },
          { id: user.managerId }
        ]
      },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }

    // Hash password if it's being updated
    let dataToUpdate = { ...updateUserDto };
    if (dataToUpdate.password) {
      dataToUpdate.password = await bcrypt.hash(dataToUpdate.password, 10);
    }

    return await this.prisma.user.update({
      where: { id },
      data: dataToUpdate,
    });
  }

  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) throw new Error('User not found');
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updateProfile(userId: number, updateData: UpdateUserDto) {
    // We can reuse the update method which handles password hashing
    const updatedUser = await this.update(userId, updateData);
    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  async remove(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    return await this.prisma.user.delete({
      where: { id },
    });
  }
}
