import { PartialType } from '@nestjs/mapped-types';
import { CreatePipelineDateDto } from './create-pipeline-date.dto';

export class UpdatePipelineDateDto extends PartialType(CreatePipelineDateDto) {}
