import { Module } from '@nestjs/common';
import { CsvImportService } from './csv-import.service';
import { CsvImportController } from './csv-import.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [CsvImportController],
  providers: [CsvImportService],
  imports: [PrismaModule],
})
export class CsvImportModule {}
