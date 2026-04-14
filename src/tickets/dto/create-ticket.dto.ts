import { ApiProperty } from "@nestjs/swagger";
import { TicketStatus, Priority } from "@prisma/client";
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateTicketDto {
    @ApiProperty({ example: 'Issue with product', description: 'The title of the ticket' })
    @IsString()
    title: string;
    @ApiProperty({ example: 'I am facing an issue with the product I purchased.', description: 'The description of the ticket' })
    @IsString()
    description: string;
    @ApiProperty({ example: 1, description: 'The ID of the user who created the ticket' })
    @IsNumber()
    userId: number;
    @ApiProperty({ example: 1, description: 'The ID of the lead associated with the ticket' })
    @IsNumber()
    leadId: number;
    @ApiProperty({ example: 1, description: 'The ID of the contact associated with the ticket' })
    @IsNumber()
    contactId: number;
    @ApiProperty({ example: 'NEW', description: 'The status of the ticket' })
    @IsEnum(TicketStatus)
    @IsOptional()
    status?: TicketStatus;
    @ApiProperty({ example: 'HIGH', description: 'The priority of the ticket', enum: Priority })
    @IsEnum(Priority)
    @IsOptional()
    priority?: Priority;
}
