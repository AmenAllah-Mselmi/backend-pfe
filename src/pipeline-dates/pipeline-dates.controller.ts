import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PipelineDatesService } from './pipeline-dates.service';
import { CreatePipelineDateDto } from './dto/create-pipeline-date.dto';
import { UpdatePipelineDateDto } from './dto/update-pipeline-date.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
@ApiTags  ('Pipeline Dates')
@Controller('pipeline-dates')
export class PipelineDatesController {
  constructor(private readonly pipelineDatesService: PipelineDatesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new pipeline date record' })
  @ApiResponse({ status: 201, description: 'The pipeline date record has been successfully created.' })
  create(@Body() createPipelineDateDto: CreatePipelineDateDto) {
    return this.pipelineDatesService.create(createPipelineDateDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve a list of all pipeline date records' })
  @ApiResponse({ status: 200, description: 'A list of pipeline date records has been successfully retrieved.' })
  findAll() {
    return this.pipelineDatesService.findAll();
  }

  @Get(':dateId/:pipelineId')
  @ApiOperation({ summary: 'Retrieve a specific pipeline date record by date ID and pipeline ID' })
  @ApiResponse({ status: 200, description: 'The pipeline date record has been successfully retrieved.' })
  findOne(@Param('dateId') dateId: string, @Param('pipelineId') pipelineId: string) {
    return this.pipelineDatesService.findOne(+dateId, +pipelineId);
  }

  @Patch(':dateId/:pipelineId')
  @ApiOperation({ summary: 'Update an existing pipeline date record' })
  @ApiResponse({ status: 200, description: 'The pipeline date record has been successfully updated.' })
  update(@Param('dateId') dateId: string, @Param('pipelineId') pipelineId: string, @Body() updatePipelineDateDto: UpdatePipelineDateDto) {
    return this.pipelineDatesService.update(+dateId, +pipelineId  , updatePipelineDateDto);
  }

  @Delete(':dateId/:pipelineId')
  @ApiOperation({ summary: 'Delete a pipeline date record' })
  @ApiResponse({ status: 200, description: 'The pipeline date record has been successfully deleted.' })
  remove(@Param('dateId') dateId: string, @Param('pipelineId') pipelineId: string) {
    return this.pipelineDatesService.remove(+dateId, +pipelineId);
  }
}
