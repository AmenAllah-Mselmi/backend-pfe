import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { DealsService } from './deals.service';
import { CreateDealDto } from './dto/create-deal.dto';
import { UpdateDealDto } from './dto/update-deal.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';

@ApiTags('Deals')
@UseGuards(AuthGuard)
@Controller('deals')
export class DealsController {
  constructor(private readonly dealsService: DealsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new deal record' })
  @ApiResponse({ status: 201, description: 'The deal record has been successfully created.' })
  create(@Body() createDealDto: CreateDealDto, @CurrentUser() user: any) {
    return this.dealsService.create(createDealDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve a list of all deal records' })
  @ApiResponse({ status: 200, description: 'A list of deal records has been successfully retrieved.' })
  findAll(@CurrentUser() user: any) {
    return this.dealsService.findAll(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a specific deal record by ID' })
  @ApiResponse({ status: 200, description: 'The deal record has been successfully retrieved.' })
  findOne(@Param('id') id: string) {
    return this.dealsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing deal record' })
  @ApiResponse({ status: 200, description: 'The deal record has been successfully updated.' })
  update(@Param('id') id: string, @Body() updateDealDto: UpdateDealDto) {
    return this.dealsService.update(+id, updateDealDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a deal record' })
  @ApiResponse({ status: 200, description: 'The deal record has been successfully deleted.' })
  remove(@Param('id') id: string) {
    return this.dealsService.remove(+id);
  }
}
