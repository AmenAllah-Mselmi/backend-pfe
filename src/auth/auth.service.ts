import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { LoginDto } from 'src/users/dto/login';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
  ) { }

  async login(dto: LoginDto, response: Response) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const passwordMatch = await bcrypt.compare(dto.password, user.password);

    if (!passwordMatch)
      throw new UnauthorizedException('Invalid credentials');

    const { password: _, ...userWithoutPassword } = user;
    const tokenData = this.generateToken(user.id, user.email, user.role);
    const isProduction = process.env.NODE_ENV === 'production';
    
    response.cookie('token', tokenData.access_token, {
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

    return {
      user: userWithoutPassword,
      ...tokenData
    };
  }

  private generateToken(userId: number, email: string, role: string) {
    const payload = { sub: userId, email, role };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async getMe(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) throw new UnauthorizedException('User not found');
    
    const { password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword };
  }
}
