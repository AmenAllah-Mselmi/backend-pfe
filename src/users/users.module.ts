import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [PrismaModule,JwtModule.register({
    global: true,
    secret: process.env.JWT_SECRET || 'default_secret',
    signOptions: { expiresIn: 3600 },
  })],
  exports: [JwtModule]
})
export class UsersModule {}
