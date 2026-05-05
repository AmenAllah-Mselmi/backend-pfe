import { Module } from '@nestjs/common';
import { LeadScoringService } from './lead-scoring.service';
import { LeadScoringController } from './lead-scoring.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    PrismaModule,
    ScheduleModule.forRoot()
  ],
  controllers: [LeadScoringController],
  providers: [LeadScoringService],
})
export class LeadScoringModule {}
