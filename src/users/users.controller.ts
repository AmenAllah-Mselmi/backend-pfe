import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login';
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

  @Post('logout')
  @ApiOperation({ summary: 'Logout a user physically destroying cookies' })
  logout(@Res({passthrough:true}) response:Response) {
    response.clearCookie('token');
    response.clearCookie('isAuthenticated');
    response.clearCookie('userRole');
    return { message: 'Tokens cleared successfully' };
  }

@Post("login")
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({ status: 200, description: 'The user has been successfully logged in.' })
  login(@Body() createAuthDto: LoginDto,@Res({passthrough:true}) response:Response) {
    return this.usersService.login(createAuthDto,response);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Retrieve a list of all users' })
  @ApiResponse({ status: 200, description: 'A list of users has been successfully retrieved.' })
  findAll(@CurrentUser() user: any) {
    return this.usersService.findAll(user);
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
