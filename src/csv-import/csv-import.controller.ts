import { Controller, Get, Post, Param, Delete, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { CsvImportService } from './csv-import.service';
import { ApiOperation, ApiResponse, ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';

@ApiTags('CSV Import')
@Controller('csv')
@UseGuards(AuthGuard)
export class CsvImportController {
  constructor(private readonly csvImportService: CsvImportService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Upload and parse a CSV file to import leads' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'The CSV file has been successfully uploaded and processed.' })
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File, @CurrentUser() user: any) {
    return this.csvImportService.uploadCsv(file, user.sub);
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

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a CSV import record' })
  @ApiResponse({ status: 200, description: 'The CSV import record has been successfully deleted.' })
  remove(@Param('id') id: string) {
    return this.csvImportService.remove(+id);
  }
}
