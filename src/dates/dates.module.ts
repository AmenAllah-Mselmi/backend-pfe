import { Module } from '@nestjs/common';
import { DatesService } from './dates.service';
import { DatesController } from './dates.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [DatesController],
  providers: [DatesService],
  imports: [PrismaModule],
})
export class DatesModule {}
