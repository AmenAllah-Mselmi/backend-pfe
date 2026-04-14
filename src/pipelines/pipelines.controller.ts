import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PipelinesService } from './pipelines.service';
import { CreatePipelineDto } from './dto/create-pipeline.dto';
import { UpdatePipelineDto } from './dto/update-pipeline.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';

@ApiTags('Pipelines')
@UseGuards(AuthGuard)
@Controller('pipelines')
export class PipelinesController {
  constructor(private readonly pipelinesService: PipelinesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new pipeline' })
  @ApiResponse({ status: 201, description: 'The pipeline has been successfully created.' })
  create(@Body() createPipelineDto: CreatePipelineDto, @CurrentUser() user: any) {
    return this.pipelinesService.create(createPipelineDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve a list of all pipelines' })
  @ApiResponse({ status: 200, description: 'A list of pipelines has been successfully retrieved.' })
  findAll(@CurrentUser() user: any) {
    return this.pipelinesService.findAll(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a specific pipeline by ID' })
  @ApiResponse({ status: 200, description: 'The pipeline has been successfully retrieved.' })
  findOne(@Param('id') id: string) {
    return this.pipelinesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing pipeline' })
  @ApiResponse({ status: 200, description: 'The pipeline has been successfully updated.' })
  update(@Param('id') id: string, @Body() updatePipelineDto: UpdatePipelineDto) {
    return this.pipelinesService.update(+id, updatePipelineDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a pipeline' })
  @ApiResponse({ status: 200, description: 'The pipeline has been successfully deleted.' })
  remove(@Param('id') id: string) {
    return this.pipelinesService.remove(+id);
  }
}
