import { Module } from '@nestjs/common';
import { PipelinesService } from './pipelines.service';
import { PipelinesController } from './pipelines.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [PipelinesController],
  providers: [PipelinesService],
  imports: [PrismaModule]
})
export class PipelinesModule {}
