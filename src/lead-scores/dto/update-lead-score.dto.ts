import { PartialType } from '@nestjs/mapped-types';
import { CreateLeadScoreDto } from './create-lead-score.dto';

export class UpdateLeadScoreDto extends PartialType(CreateLeadScoreDto) {}
