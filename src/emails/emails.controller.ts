import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { EmailsService } from './emails.service';
import { CreateEmailDto } from './dto/create-email.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Emails')
@Controller('emails')
export class EmailsController {
  constructor(private readonly emailsService: EmailsService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new email record' })
  @ApiResponse({ status: 201, description: 'The email record has been successfully created.' })
  create(@Body() createEmailDto: CreateEmailDto) {
    return this.emailsService.create(createEmailDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve a list of all email records' })
  @ApiResponse({ status: 200, description: 'A list of email records has been successfully retrieved.' })
  findAll(
    @Query('contactId') contactId?: string,
    @Query('leadId') leadId?: string,
    @Query('userId') userId?: string,
  ) {
    return this.emailsService.findAll(
      contactId ? +contactId : undefined,
      leadId ? +leadId : undefined,
      userId ? +userId : undefined,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a specific email record by ID' })
  @ApiResponse({ status: 200, description: 'The email record has been successfully retrieved.' })
  findOne(@Param('id') id: string) {
    return this.emailsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing email record' })
  @ApiResponse({ status: 200, description: 'The email record has been successfully updated.' })
  update(@Param('id') id: string, @Body() updateEmailDto: UpdateEmailDto) {
    return this.emailsService.update(+id, updateEmailDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an email record' })
  @ApiResponse({ status: 200, description: 'The email record has been successfully deleted.' })
  remove(@Param('id') id: string) {
    return this.emailsService.remove(+id);
  }

  @Get('user/:userId/contact/:contactId')
  findByUserAndContact(
    @Param('userId') userId: string,
    @Param('contactId') contactId: string,
  ) {
    return this.emailsService.findAll(+contactId, undefined, +userId);
  }

  @Get('user/:userId/lead/:leadId')
  findByUserAndLead(
    @Param('userId') userId: string,
    @Param('leadId') leadId: string,
  ) {
    return this.emailsService.findAll(undefined, +leadId, +userId);
  }
}
