import { Module } from '@nestjs/common';
import { LeadScoresService } from './lead-scores.service';
import { LeadScoresController } from './lead-scores.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [LeadScoresController],
  providers: [LeadScoresService],
  imports: [PrismaModule],
})
export class LeadScoresModule {}
