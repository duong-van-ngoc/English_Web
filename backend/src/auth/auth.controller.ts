import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import type { ApiResponse } from '../common/interfaces/api-response.interface';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import type { AuthenticatedUser } from './interfaces/authenticated-user.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<ApiResponse<AuthenticatedUser>> {
    const user = await this.authService.register(registerDto);

    return {
      success: true,
      message: 'Registered successfully',
      data: user,
    };
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<
    ApiResponse<{
      accessToken: string;
      user: AuthenticatedUser;
    }>
  > {
    const result = await this.authService.login(loginDto);

    return {
      success: true,
      message: 'Logged in successfully',
      data: result,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(
    @CurrentUser() user: AuthenticatedUser,
  ): ApiResponse<AuthenticatedUser> {
    return {
      success: true,
      message: 'Current user fetched successfully',
      data: user,
    };
  }
}
