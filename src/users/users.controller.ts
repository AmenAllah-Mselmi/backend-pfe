import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';
import { User } from '@prisma/client';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'The user has been successfully created.' })
  create(@Body() createUserDto: CreateUserDto, @Res({passthrough:true}) response:Response) {
    return this.usersService.create(createUserDto, response);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Retrieve a list of all users' })
  @ApiResponse({ status: 200, description: 'A list of users has been successfully retrieved.' })
  findAll(@CurrentUser() user: any) {
    return this.usersService.findAll(user);
  }

  @Get('profile/me')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Retrieve the current user profile' })
  @ApiResponse({ status: 200, description: 'The profile has been successfully retrieved.' })
  getProfile(@CurrentUser() user: any) {
    return this.usersService.getProfile(user.sub);
  }

  @Patch('profile/me')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update the current user profile' })
  @ApiResponse({ status: 200, description: 'The profile has been successfully updated.' })
  updateProfile(@CurrentUser() user: any, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateProfile(user.sub, updateUserDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a specific user by ID' })
  @ApiResponse({ status: 200, description: 'The user has been successfully retrieved.' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing user' })
  @ApiResponse({ status: 200, description: 'The user has been successfully updated.' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: 200, description: 'The user has been successfully deleted.' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
