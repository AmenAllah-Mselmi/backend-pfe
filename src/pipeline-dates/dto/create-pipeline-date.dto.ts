import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class CreatePipelineDateDto {
    @ApiProperty({ example: 1, description: 'The order of the date in the pipeline' })
    @IsNumber()
    order: number;
    @ApiProperty({ example: 1, description: 'The ID of the date' })
    @IsNumber()
    dateId: number;
    @ApiProperty({ example: 1, description: 'The ID of the pipeline' })
    @IsNumber()
    pipelineId: number;
}
