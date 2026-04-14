import { IsString, IsOptional, IsBoolean, IsArray, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChatDto {
  @ApiProperty({ description: 'Optional name for group chats', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Is it a group chat?', default: false })
  @IsOptional()
  @IsBoolean()
  isGroup?: boolean;

  @ApiProperty({ description: 'Array of User IDs to include in the chat' })
  @IsArray()
  @IsInt({ each: true })
  userIds: number[];
}
