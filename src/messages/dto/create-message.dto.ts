// dto/message/create-message.dto.ts
import { IsNotEmpty, IsString, IsOptional, IsUUID, MaxLength, MinLength, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty({
    description: 'Content of the message',
    example: 'Hello, how are you?',
    minLength: 1,
    maxLength: 2000
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  content: string;

  @ApiProperty({
    description: 'ID of the chat',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsNotEmpty()
  @IsUUID()
  chatId: string;

  @ApiProperty({
    description: 'ID of the receiver (optional for group chats)',
    example: 1,
    required: false
  })
  @IsOptional()
  @IsInt()
  receiverId?: number;
}