import { Controller, Post, Body, Res, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from 'src/users/dto/login';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({ status: 200, description: 'The user has been successfully logged in.' })
  login(@Body() createAuthDto: LoginDto, @Res({ passthrough: true }) response: Response) {
    return this.authService.login(createAuthDto, response);
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout a user physically destroying cookies' })
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('token');
    response.clearCookie('isAuthenticated');
    response.clearCookie('userRole');
    return { message: 'Tokens cleared successfully' };
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get current logged in user' })
  @ApiResponse({ status: 200, description: 'The user profile has been successfully retrieved.' })
  async getMe(@CurrentUser() user: any) {
    return this.authService.getMe(user.sub);
  }
}
