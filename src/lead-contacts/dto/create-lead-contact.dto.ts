import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class CreateLeadContactDto {
    @ApiProperty({ example: 'Decision Maker', description: 'The role of the contact in relation to the lead' })
    @IsString()
    role:string;
    @ApiProperty({ example: 1, description: 'The ID of the contact associated with the lead' })
    @IsNumber()
    contactId:number;
    @ApiProperty({ example: 1, description: 'The ID of the lead associated with the contact' })
    @IsNumber()
    leadId:number;
}
