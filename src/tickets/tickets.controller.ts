import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';

@ApiTags('Tickets')
@UseGuards(AuthGuard)
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new ticket' })
  @ApiResponse({ status: 201, description: 'The ticket has been successfully created.' }) 
  create(@Body() createTicketDto: CreateTicketDto, @CurrentUser() user: any) {
    return this.ticketsService.create(createTicketDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve a list of all tickets' })
  @ApiResponse({ status: 200, description: 'A list of tickets has been successfully retrieved.' })
  findAll(@CurrentUser() user: any) {
    return this.ticketsService.findAll(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a specific ticket by ID' })
  @ApiResponse({ status: 200, description: 'The ticket has been successfully retrieved.' })
  findOne(@Param('id') id: string) {
    return this.ticketsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing ticket' })
  @ApiResponse({ status: 200, description: 'The ticket has been successfully updated.' })
  update(@Param('id') id: string, @Body() updateTicketDto: UpdateTicketDto) {
    return this.ticketsService.update(+id, updateTicketDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a ticket' })
  @ApiResponse({ status: 200, description: 'The ticket has been successfully deleted.' })
  remove(@Param('id') id: string) {
    return this.ticketsService.remove(+id);
  }
}
