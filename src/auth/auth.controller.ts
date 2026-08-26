import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService, type LoginResponse } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import type { AuthenticatedUser } from './interfaces/authenticated-user.interface';
import { Throttle } from '@nestjs/throttler';
import { HttpCode } from '@nestjs/common';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Throttle({
    default: {
      limit: 5,
      ttl: 60_000,
    },
  })
  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Authenticate a user' })
  @ApiOkResponse({ description: 'Authentication successful' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiTooManyRequestsResponse({
    description: 'Too many login attempts',
  })
  login(@Body() credentials: LoginDto): Promise<LoginResponse> {
    return this.authService.login(credentials);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get authenticated user profile' })
  @ApiOkResponse({ description: 'Authenticated user profile' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing token' })
  getProfile(@CurrentUser() user: AuthenticatedUser): AuthenticatedUser {
    return user;
  }
}
