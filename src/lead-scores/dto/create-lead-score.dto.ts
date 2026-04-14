import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class CreateLeadScoreDto {
    @ApiProperty({ example: 80, description: 'The score of the lead' })
    @IsNumber()
    score: number;
    @ApiProperty({ example: 1, description: 'The ID of the lead associated with the score' })
    @IsNumber()
    leadId: number;
}
