
import { ApiProperty } from "@nestjs/swagger"
import { CompanyIndustry, CompanySize } from "@prisma/client"
import { IsEmail, IsEnum, IsString, IsNumber } from "class-validator"


export class CreateCompanyDto {
@ApiProperty({ example: 'Acme Corporation', description: 'The name of the company' })
@IsString()
name: string
@ApiProperty({ example: 'acme@example.com', description: 'The email address of the company' })
@IsEmail()
email: string
@ApiProperty({ example: '+1234567890', description: 'The phone number of the company' })
@IsString()
phone: string
@ApiProperty({ example: 'Technology', description: 'The industry of the company', enum: CompanyIndustry })
@IsEnum(CompanyIndustry)
companyIndustry: CompanyIndustry
@ApiProperty({ example: 'Medium', description: 'The size of the company', enum: CompanySize })
@IsEnum(CompanySize)
companySize: CompanySize
@ApiProperty({ example: '123 Main St, Anytown, USA', description: 'The location of the company' })
@IsString()
location: string    
@ApiProperty({ example: 1000000, description: 'The revenue of the company' })
@IsNumber()
revenue?: number
}
