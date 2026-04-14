import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import { AuthGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';

@ApiTags('Companies')
@UseGuards(AuthGuard)
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new company' })
  @ApiResponse({ status: 201, description: 'The company has been successfully created.' })
  create(@Body() createCompanyDto: CreateCompanyDto, @CurrentUser() user: any) {
    return this.companiesService.create(createCompanyDto, user);
  }

  @Get()
    @ApiOperation({ summary: 'Retrieve a list of all companies' })
    @ApiResponse({ status: 200, description: 'A list of companies has been successfully retrieved.' })
  findAll(@CurrentUser() user: any) {
    return this.companiesService.findAll(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a specific company by ID' })
  @ApiResponse({ status: 200, description: 'The company has been successfully retrieved.' })
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing company' })
  @ApiResponse({ status: 200, description: 'The company has been successfully updated.' })
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companiesService.update(+id, updateCompanyDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a company' })
  @ApiResponse({ status: 200, description: 'The company has been successfully deleted.' })
  remove(@Param('id') id: string) {
    return this.companiesService.remove(+id);
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const uploadPath = './uploads';
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        const safeName = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
        cb(null, safeName);
      },
    }),
  }))
  @ApiOperation({ summary: 'Import companies from CSV file' })
  @ApiResponse({ status: 200, description: 'CSV processed and companies imported.' })
  async importCsv(@UploadedFile() file: any) {
    if (!file) throw new Error('File is required');
    try {
      const result = await this.companiesService.importCsv(file.path);
      try { fs.unlinkSync(file.path); } catch (e) { /* ignore */ }
      return result;
    } catch (err) {
      try { fs.unlinkSync(file.path); } catch (e) { /* ignore */ }
      throw err;
    }
  }

  @Post('import-bulk')
  @ApiOperation({ summary: 'Import companies in bulk from JSON array' })
  @ApiResponse({ status: 201, description: 'Bulk companies imported.' })
  async importBulk(@Body() data: any[], @CurrentUser() user: any) {
    return this.companiesService.importBulk(data, user);
  }
}
