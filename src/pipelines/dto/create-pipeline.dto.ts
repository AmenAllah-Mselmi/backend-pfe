import { ApiProperty } from '@nestjs/swagger';
import {  PipelineStage } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class CreatePipelineDto {
 @ApiProperty({ example: 'Sales Pipeline', description: 'The name of the pipeline' })   
@IsString()
name: string
@ApiProperty({ example: 'PIPELINE_STAGE_1', description: 'The stage of the pipeline', enum: PipelineStage, required: false })
@IsOptional()
@IsEnum(PipelineStage)
stage: PipelineStage
}
