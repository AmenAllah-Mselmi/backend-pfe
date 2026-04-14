import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsDateString } from "class-validator";

export class CreateDateDto {
  @ApiProperty({ example: '2024-12-31', description: 'The date in ISO format (YYYY-MM-DD)' })
  @IsOptional() 
  @IsDateString()
  date?: string; 
}