import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LeadContactsService } from './lead-contacts.service';
import { CreateLeadContactDto } from './dto/create-lead-contact.dto';
import { UpdateLeadContactDto } from './dto/update-lead-contact.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
@ApiTags  ('Lead Contacts')
@Controller('lead-contacts')
export class LeadContactsController {
  constructor(private readonly leadContactsService: LeadContactsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new lead contact record' })
  @ApiResponse({ status: 201, description: 'The lead contact record has been successfully created.' })
  create(@Body() createLeadContactDto: CreateLeadContactDto) {
    return this.leadContactsService.create(createLeadContactDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve a list of all lead contact records' })
  @ApiResponse({ status: 200, description: 'A list of lead contact records has been successfully retrieved.' })
  findAll() {
    return this.leadContactsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a specific lead contact record by ID' })
  @ApiResponse({ status: 200, description: 'The lead contact record has been successfully retrieved.' })
  findOne(@Param('id') id: string) {
    return this.leadContactsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing lead contact record' })
  @ApiResponse({ status: 200, description: 'The lead contact record has been successfully updated.' })
  update(@Param('id') id: string, @Body() updateLeadContactDto: UpdateLeadContactDto) {
    return this.leadContactsService.update(+id, updateLeadContactDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a lead contact record' })
  @ApiResponse({ status: 200, description: 'The lead contact record has been successfully deleted.' })
  remove(@Param('id') id: string) {
    return this.leadContactsService.remove(+id);
  }
}
