import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DatesService } from './dates.service';
import { CreateDateDto } from './dto/create-date.dto';
import { UpdateDateDto } from './dto/update-date.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags("Dates")
@Controller('dates')
export class DatesController {
  constructor(private readonly datesService: DatesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new date record' })
  @ApiResponse({ status: 201, description: 'The date record has been successfully created.' })
  create(@Body() createDateDto: CreateDateDto) {
    return this.datesService.create(createDateDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve a list of all date records' })
  @ApiResponse({ status: 200, description: 'A list of date records has been successfully retrieved.' })
  findAll() {
    return this.datesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a specific date record by ID' })
  @ApiResponse({ status: 200, description: 'The date record has been successfully retrieved.' })
  findOne(@Param('id') id: string) {
    return this.datesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing date record' })
  @ApiResponse({ status: 200, description: 'The date record has been successfully updated.' })  
  update(@Param('id') id: string, @Body() updateDateDto: UpdateDateDto) {
    return this.datesService.update(+id, updateDateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a date record' })
  @ApiResponse({ status: 200, description: 'The date record has been successfully deleted.' })
  remove(@Param('id') id: string) {
    return this.datesService.remove(+id);
  }
}
