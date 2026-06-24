import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ManagerService } from './admin.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';

@ApiTags('Manager')
@Controller('admin')
@UseGuards(AuthGuard)
export class ManagerController {
  constructor(private readonly managerService: ManagerService) { }

  @Post('users')
  @ApiOperation({ summary: 'Create a new user (Admin)' })
  @ApiResponse({ status: 201, description: 'The user has been successfully created.' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.managerService.create(createUserDto);
  }

  @Get('users')
  @ApiOperation({ summary: 'Retrieve a list of all users (Admin)' })
  @ApiResponse({ status: 200, description: 'A list of users has been successfully retrieved.' })
  findAll(@CurrentUser() user: any) {
    return this.managerService.findAll(user);
  }

  @Get('users/:id')
  @ApiOperation({ summary: 'Retrieve a specific user by ID (Admin)' })
  @ApiResponse({ status: 200, description: 'The user has been successfully retrieved.' })
  findOne(@Param('id') id: string) {
    return this.managerService.findOne(+id);
  }

  @Patch('users/:id')
  @ApiOperation({ summary: 'Update an existing user (Admin)' })
  @ApiResponse({ status: 200, description: 'The user has been successfully updated.' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.managerService.update(+id, updateUserDto);
  }

  @Delete('users/:id')
  @ApiOperation({ summary: 'Delete a user (Admin)' })
  @ApiResponse({ status: 200, description: 'The user has been successfully deleted.' })
  remove(@Param('id') id: string) {
    return this.managerService.remove(+id);
  }
}
