import { Module } from '@nestjs/common';
import { ManagerController } from './admin.controller';
import { ManagerService } from './admin.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ManagerController],
  providers: [ManagerService],
})
export class AdminModule { }
