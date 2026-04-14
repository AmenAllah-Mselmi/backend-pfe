import { PartialType } from '@nestjs/mapped-types';
import { CreateCsvImportDto } from './create-csv-import.dto';

export class UpdateCsvImportDto extends PartialType(CreateCsvImportDto) {}
