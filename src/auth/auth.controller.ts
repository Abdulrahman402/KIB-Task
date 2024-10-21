import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './auth.dto';
import { LoginResponseDto } from './auth.response.dto';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  @ApiCreatedResponse({
    description: 'User signed up successfully.',
    type: LoginResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid sign-up data.' })
  async signUp(@Body() signUpDto: AuthDto): Promise<LoginResponseDto> {
    const result = await this.authService.signUp(signUpDto);
    return {
      user: result.user,
      access_token: result.access_token,
      refresh_token: result.refresh_token,
    };
  }

  @Post('login')
  @ApiOkResponse({
    description: 'User logged in successfully.',
    type: LoginResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid login credentials.' })
  async login(@Body() loginDto: AuthDto): Promise<LoginResponseDto> {
    const result = await this.authService.login(loginDto);
    return {
      user: result.user,
      access_token: result.access_token,
      refresh_token: result.refresh_token,
    };
  }
}
