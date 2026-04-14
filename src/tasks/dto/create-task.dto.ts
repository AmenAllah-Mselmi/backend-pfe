import { ApiProperty } from "@nestjs/swagger";
import { TaskStatus, Priority } from "@prisma/client";
import { IsDate, IsEnum, IsNumber, IsString, IsOptional } from "class-validator";
import { Type } from "class-transformer";

export class CreateTaskDto {
    @ApiProperty({ example: 'Follow up with client', description: 'The title of the task' })
    @IsString()
    title: string;
    @ApiProperty({ example: '2024-12-31', description: 'The due date of the task' })
    @Type(() => Date)
    @IsDate()
    dueDate: Date;
    @ApiProperty({ example: 'PENDING', description: 'The status of the task', enum: TaskStatus })
    @IsEnum(TaskStatus)
    status: TaskStatus;
    @ApiProperty({ example: 1, description: 'The ID of the lead associated with the task' })
    @IsNumber()
    leadId: number;
    @ApiProperty({ example: 1, description: 'The ID of the user associated with the task' })
    @IsNumber()
    userId: number;
    @ApiProperty({ example: 'HIGH', description: 'The priority of the task', enum: Priority })
    @IsEnum(Priority)
    @IsOptional()
    priority?: Priority;
}
