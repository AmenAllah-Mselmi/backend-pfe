import { ApiProperty } from "@nestjs/swagger";
import { DealStatus } from "@prisma/client";
import { IsDate, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";

export class CreateDealDto {
    @ApiProperty({ example: 'Big Deal with Acme Corp', description: 'The name of the deal' })
    @IsString()
    name: string;
    @ApiProperty({ example: 100000, description: 'The amount of the deal' })
    @IsNumber()
    amount: number;
    @ApiProperty({ example: 75, description: 'The probability of closing the deal (in percentage)' })
    @IsNumber()
    probability: number;
    @ApiProperty({ example: '2024-12-31', description: 'The expected close date of the deal' })
    @Type(() => Date)
    @IsDate()
    expectedCloseDate: Date;
    @ApiProperty({ example: 'NEGOTIATION', description: 'The current status of the deal', enum: DealStatus })
    @IsEnum(DealStatus)
    status: DealStatus;
    @ApiProperty({ example: 1, description: 'The ID of the lead associated with the deal' })
    @IsNumber()
    leadId: number;

    @ApiProperty({ example: 1, description: 'The ID of the pipeline associated with the deal', required: false })
    @IsOptional()
    @IsNumber()
    pipelineId?: number;
}
