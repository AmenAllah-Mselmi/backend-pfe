import { ApiProperty } from "@nestjs/swagger"
import { IsNumber, IsString, IsOptional } from "class-validator"

export class CreateEmailDto {
  @ApiProperty({ example: 'sender@example.com', description: 'The email address of the sender' })
  @IsString()   
  from :     string
  @ApiProperty({ example: 'recipient@example.com', description: 'The email address of the recipient' })
  @IsString()       
  to    :    string
  @ApiProperty({ example: 'Meeting Follow-up', description: 'The subject of the email' })
  @IsString()   
  subject:   string
  @ApiProperty({ example: 'Thank you for meeting with us. Here are the next steps...', description: 'The body content of the email' })
  @IsString()   
  body    :  string
  @ApiProperty({ example: 'sent', description: 'The status of the email' })
  @IsString()   
  status   : string
  @ApiProperty({ example: 'transactional', description: 'The type of the email' })
  @IsString()   
  emailType :string
  @ApiProperty({ example: '2024-06-01T12:00:00Z', description: 'The date and time when the email was sent' })
  @IsString()   
  sentAt    :string
  @ApiProperty({ example: 1, description: 'The ID of the lead associated with the email' })
  @IsOptional()
  @IsNumber()
  leadId?: number
  @ApiProperty({ example: 1, description: 'The ID of the contact associated with the email' })
  @IsOptional()
  @IsNumber()
  contactId?: number
  @ApiProperty({ example: 1, description: 'The ID of the user associated with the email' })
    @IsNumber()
  userId    :number
}
