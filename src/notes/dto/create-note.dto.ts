import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class CreateNoteDto {
    @ApiProperty({ example: 'This is a note about the lead', description: 'The content of the note' })
    @IsString()
    content:string;
    @ApiProperty({ example: 1, description: 'The ID of the lead associated with the note' })
    @IsNumber()
    leadId:number;
    @ApiProperty({ example: 1, description: 'The ID of the user associated with the note' })
    @IsNumber()
    userId:number;
}
