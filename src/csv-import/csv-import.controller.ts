import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CsvImportService } from './csv-import.service';
import { CreateCsvImportDto } from './dto/create-csv-import.dto';
import { UpdateCsvImportDto } from './dto/update-csv-import.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
@ApiTags('CSV Import')
@Controller('csv-import')
export class CsvImportController {
  constructor(private readonly csvImportService: CsvImportService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new CSV import record' })
  @ApiResponse({ status: 201, description: 'The CSV import record has been successfully created.' })
  create(@Body() createCsvImportDto: CreateCsvImportDto) {
    return this.csvImportService.create(createCsvImportDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve a list of all CSV import records' })
  @ApiResponse({ status: 200, description: 'A list of CSV import records has been successfully retrieved.' })
  findAll() {
    return this.csvImportService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a specific CSV import record by ID' })
  @ApiResponse({ status: 200, description: 'The CSV import record has been successfully retrieved.' })
  findOne(@Param('id') id: string) {
    return this.csvImportService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing CSV import record' })
  @ApiResponse({ status: 200, description: 'The CSV import record has been successfully updated.' })
  update(@Param('id') id: string, @Body() updateCsvImportDto: UpdateCsvImportDto) {
    return this.csvImportService.update(+id, updateCsvImportDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a CSV import record' })
  @ApiResponse({ status: 200, description: 'The CSV import record has been successfully deleted.' })
  remove(@Param('id') id: string) {
    return this.csvImportService.remove(+id);
  }
}
