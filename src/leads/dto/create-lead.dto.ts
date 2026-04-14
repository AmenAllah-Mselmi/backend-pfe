import { ApiProperty } from "@nestjs/swagger";
import { LeadStatus } from "@prisma/client";
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsInt
} from "class-validator";

export class CreateLeadDto {

  @ApiProperty({ example: 'John Doe', description: 'The name of the lead' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'The email of the lead' })
  @IsEmail()
  email: string;
  @ApiProperty({ example: '+1234567890', description: 'The phone number of the lead' })
  @IsString()
  phone: string;
  @ApiProperty({ example: 'Interested in our product', description: 'The status of the lead' })
  @IsOptional()
  @IsEnum(LeadStatus)
  status?: LeadStatus;
  @ApiProperty({ example: '2024-12-31', description: 'The expected close date of the lead' })
  @IsOptional()
  @IsNumber()
  probability?: number;
  @ApiProperty({ example: '2024-12-31', description: 'The expected close date of the lead' })
  @IsOptional()
  @IsDateString()
  expectedCloseDate?: string;
  @ApiProperty({ example: 'USD', description: 'The currency of the deal' })
  @IsOptional()
  @IsString()
  currency?: string;
  @ApiProperty({ example: 10000, description: 'The value of the deal' })
  @IsOptional()
  @IsNumber()
  dealValue?: number;
  @ApiProperty({ example: 1, description: 'The ID of the company associated with the lead' })
  @IsOptional()
  @IsInt()
  companyId?: number;

  @ApiProperty({ example: 1, description: 'The ID of the pipeline associated with the lead' })
  @IsOptional()
  @IsInt()
  pipelineId?: number;
}