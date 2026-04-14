import { IsInt, IsOptional, IsString, IsObject } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class CreateActivityDto {
  @ApiProperty({ example: 'note_added', description: 'The type of the activity' })
  @IsString()
  type: string

  @ApiProperty({ example: 'New Note', description: 'The title of the activity' })
  @IsString()
  title: string

  @ApiProperty({ example: 'Called the lead to discuss requirements', description: 'Detailed description' })
  @IsString()
  description: string

  @ApiProperty({ example: 'lead', description: 'The generic entity this activity is related to' })
  @IsString()
  entity: string

  @ApiProperty({ example: 1, description: 'The ID of the generic entity' })
  @IsInt()
  entityId: number

  @ApiProperty({ example: { value: 100 }, description: 'Additional context about the activity' })
  @IsOptional()
  @IsObject()
  metadata?: any

  @ApiProperty({ example: 1, description: 'The ID of the user associated with the activity' })
  @IsInt()
  userId: number
}
