import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsInt, IsOptional, IsString, MinLength } from "class-validator";
import { Role } from "@prisma/client";
import { Type } from "class-transformer";

export class CreateUserDto {
    @ApiProperty({ example: 'John Doe', description: 'The name of the user' })
    @IsString()
    name: string

    @ApiProperty({ example: 'john.doe@example.com', description: 'The email of the user' })
    @IsEmail()
    email: string

    @ApiProperty({ example: 'password123', description: 'The password of the user' })
    @MinLength(6)
    password: string

    @ApiProperty({ example: Role.ADMIN, description: 'The role of the user', enum: Role, required: false })
    @IsOptional()
    @IsEnum(Role)
    role?: Role

    @ApiProperty({ example: 'My Company Inc.', description: 'The company name', required: false })
    @IsOptional()
    @IsString()
    company?: string

    @ApiProperty({ example: 1, description: 'The ID of the manager (if REP)', required: false })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    managerId?: number
}
