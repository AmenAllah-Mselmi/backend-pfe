import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesGateway } from './messages.gateway';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ChatsModule } from 'src/chats/chats.module';

@Module({
  providers: [MessagesGateway, MessagesService],
  imports: [PrismaModule,ChatsModule]
})
export class MessagesModule {}
