import { ApiProperty } from "@nestjs/swagger"
import { ContactStatus } from "@prisma/client"
import { IsEmail, IsEnum, IsNumber, IsOptional, IsString } from "class-validator"
export class CreateContactDto {
    @ApiProperty({ example: 'Jane Doe', description: 'The name of the contact' })
    @IsString()
    name: string
    @ApiProperty({ example: 'jane.doe@example.com', description: 'The email address of the contact' })
    @IsEmail()
    email: string
    @ApiProperty({ example: '+1234567890', description: 'The phone number of the contact' })
    @IsString()
    phone: string
    @ApiProperty({ example: 1, description: 'The ID of the company associated with the contact' })
    @IsOptional()
    @IsNumber()
    companyId?: number
    @ApiProperty({ example: 'ACTIVE', description: 'The current status of the contact', enum: ContactStatus, required: false })
    @IsOptional()
    @IsEnum(ContactStatus)
    status?: ContactStatus
}
