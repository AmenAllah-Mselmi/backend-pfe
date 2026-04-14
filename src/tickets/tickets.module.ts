import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  controllers: [TicketsController],
  providers: [TicketsService],
  imports: [PrismaModule, NotificationsModule],
})
export class TicketsModule {}
