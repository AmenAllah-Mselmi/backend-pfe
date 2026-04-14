
import { ApiProperty } from "@nestjs/swagger"
import { ImportStatus } from "@prisma/client"
import { IsEnum, IsInt, IsString } from "class-validator"


export class CreateCsvImportDto {
@ApiProperty({ example: 'leads_import.csv', description: 'The name of the imported CSV file' })
@IsString()
fileName: string
@ApiProperty({ example: 'PENDING', description: 'The current status of the import process', enum: ImportStatus })
@IsEnum(ImportStatus)
status?: ImportStatus
@ApiProperty({ example: 100, description: 'The number of rows in the imported CSV file' })
@IsInt()
numberOfRows: number
@ApiProperty({ example: 1, description: 'The ID of the user who initiated the import' })
@IsInt()
userId: number
}
