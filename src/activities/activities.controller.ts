import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';

@ApiTags('Activities')
@UseGuards(AuthGuard)
@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new activity' })
  @ApiResponse({ status: 201, description: 'The activity has been successfully created.' })
  create(@Body() createActivityDto: CreateActivityDto, @CurrentUser() user: any) {
    return this.activitiesService.create(createActivityDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve a list of all activities' })
  @ApiResponse({ status: 200, description: 'A list of activities has been successfully retrieved.' })
  findAll(
    @CurrentUser() user: any,
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    return this.activitiesService.findAll(user, {
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined
    });
  }
  @ApiOperation({ summary: 'Retrieve a specific activity by ID' })
  @ApiResponse({ status: 200, description: 'The activity has been successfully retrieved.' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.activitiesService.findOne(+id);
  }
  @ApiOperation({ summary: 'Update an existing activity' })
  @ApiResponse({ status: 200, description: 'The activity has been successfully updated.' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateActivityDto: UpdateActivityDto) {
    return this.activitiesService.update(+id, updateActivityDto);
  }
  @ApiOperation({ summary: 'Delete an activity' })
  @ApiResponse({ status: 200, description: 'The activity has been successfully deleted.' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.activitiesService.remove(+id);
  }
}
