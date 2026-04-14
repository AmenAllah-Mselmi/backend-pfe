import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import { AuthGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';

@ApiTags('Leads')
@UseGuards(AuthGuard)
@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new lead' })
  @ApiResponse({ status: 201, description: 'The lead has been successfully created.' })
  create(@Body() createLeadDto: CreateLeadDto, @CurrentUser() user: any) {
    return this.leadsService.create(createLeadDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve a list of all leads' })
  @ApiResponse({ status: 200, description: 'A list of leads has been successfully retrieved.' })
  findAll(@CurrentUser() user: any) {
    return this.leadsService.findAll(user);
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
  // @ApiOperation({ summary: 'Import leads from CSV file' })
  // @ApiResponse({ status: 200, description: 'CSV processed and leads imported.' })
  // async importCsv(@UploadedFile() file: any) {
  //   if (!file) {
  //     throw new Error('File is required');
  //   }
  //   try {
  //     const result = await this.leadsService.importCsv(file.path);
  //     try { fs.unlinkSync(file.path); } catch (e) { /* ignore */ }
  //     return result;
  //   } catch (err) {
  //     try { fs.unlinkSync(file.path); } catch (e) { /* ignore */ }
  //     throw err;
  //   }
  // }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a specific lead by ID' })
  @ApiResponse({ status: 200, description: 'The lead has been successfully retrieved.' })
  findOne(@Param('id') id: string) {
    const parsed = parseInt(id, 10);
    if (isNaN(parsed)) throw new BadRequestException('Invalid id parameter');
    return this.leadsService.findOne(parsed);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing lead' })
  @ApiResponse({ status: 200, description: 'The lead has been successfully updated.' })
  update(@Param('id') id: string, @Body() updateLeadDto: UpdateLeadDto) {
    return this.leadsService.update(+id, updateLeadDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a lead' })
  @ApiResponse({ status: 200, description: 'The lead has been successfully deleted.' })
  remove(@Param('id') id: string) {
    return this.leadsService.remove(+id);
  }
  @Get('byUser/:id')
  @ApiOperation({summary:'Find lead by userId'})
  @ApiResponse({status:200,description:'we successfully find the leads fo the sales represantative'})
  getByUserId(@Param('id') id:string){
    return this.leadsService.findbyUserId(+id)
  }
  
  @Post('import-bulk')
  @ApiOperation({ summary: 'Import leads in bulk from JSON array' })
  @ApiResponse({ status: 201, description: 'Bulk leads imported.' })
  async importBulk(@Body() data: any[], @CurrentUser() user: any) {
    return this.leadsService.importBulk(data, user);
  }
}
