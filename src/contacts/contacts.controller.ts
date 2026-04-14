import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import { AuthGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';

@ApiTags('Contacts')
@UseGuards(AuthGuard)
@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new contact' })
  @ApiResponse({ status: 201, description: 'The contact has been successfully created.' })
  create(@Body() createContactDto: CreateContactDto, @CurrentUser() user: any) {
    return this.contactsService.create(createContactDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve a list of all contacts' })
  @ApiResponse({ status: 200, description: 'A list of contacts has been successfully retrieved.' })
  findAll(@CurrentUser() user: any) {
    return this.contactsService.findAll(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a specific contact by ID' })
  @ApiResponse({ status: 200, description: 'The contact has been successfully retrieved.' })
  findOne(@Param('id') id: string) {
    return this.contactsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing contact' })
  @ApiResponse({ status: 200, description: 'The contact has been successfully updated.' })
  update(@Param('id') id: string, @Body() updateContactDto: UpdateContactDto) {
    return this.contactsService.update(+id, updateContactDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a contact' })
  @ApiResponse({ status: 200, description: 'The contact has been successfully deleted.' })
  remove(@Param('id') id: string) {
    return this.contactsService.remove(+id);
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
  @ApiOperation({ summary: 'Import contacts from CSV file' })
  @ApiResponse({ status: 200, description: 'CSV processed and contacts imported.' })
  async importCsv(@UploadedFile() file: any) {
    if (!file) throw new Error('File is required');
    try {
      const result = await this.contactsService.importCsv(file.path);
      try { fs.unlinkSync(file.path); } catch (e) { /* ignore */ }
      return result;
    } catch (err) {
      try { fs.unlinkSync(file.path); } catch (e) { /* ignore */ }
      throw err;
    }
  }

  @Post('import-bulk')
  @ApiOperation({ summary: 'Import contacts in bulk from JSON array' })
  @ApiResponse({ status: 201, description: 'Bulk contacts imported.' })
  async importBulk(@Body() data: any[], @CurrentUser() user: any) {
    return this.contactsService.importBulk(data, user);
  }
}
