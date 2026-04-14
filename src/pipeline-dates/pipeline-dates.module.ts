import { Module } from '@nestjs/common';
import { PipelineDatesService } from './pipeline-dates.service';
import { PipelineDatesController } from './pipeline-dates.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [PipelineDatesController],
  providers: [PipelineDatesService],
  imports: [PrismaModule],
})
export class PipelineDatesModule {}
