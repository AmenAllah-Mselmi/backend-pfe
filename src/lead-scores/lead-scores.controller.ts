import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LeadScoresService } from './lead-scores.service';
import { CreateLeadScoreDto } from './dto/create-lead-score.dto';
import { UpdateLeadScoreDto } from './dto/update-lead-score.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
@ApiTags('Lead Scores')
@Controller('lead-scores')
export class LeadScoresController {
  constructor(private readonly leadScoresService: LeadScoresService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new lead score record' })
  @ApiResponse({ status: 201, description: 'The lead score record has been successfully created.' })
  create(@Body() createLeadScoreDto: CreateLeadScoreDto) {
    return this.leadScoresService.create(createLeadScoreDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve a list of all lead score records' })
  @ApiResponse({ status: 200, description: 'A list of lead score records has been successfully retrieved.' })
  findAll() {
    return this.leadScoresService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a specific lead score record by ID' })
  @ApiResponse({ status: 200, description: 'The lead score record has been successfully retrieved.' })
  findOne(@Param('id') id: string) {
    return this.leadScoresService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing lead score record' })
  @ApiResponse({ status: 200, description: 'The lead score record has been successfully updated.' })
  update(@Param('id') id: string, @Body() updateLeadScoreDto: UpdateLeadScoreDto) {
    return this.leadScoresService.update(+id, updateLeadScoreDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a lead score record' })
  @ApiResponse({ status: 200, description: 'The lead score record has been successfully deleted.' })
  remove(@Param('id') id: string) {
    return this.leadScoresService.remove(+id);
  }
}
