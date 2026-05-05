import { Module } from '@nestjs/common';
import { AiEmailService } from './ai-email.service';
import { AiEmailController } from './ai-email.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AiEmailController],
  providers: [AiEmailService],
})
export class AiEmailModule {}
