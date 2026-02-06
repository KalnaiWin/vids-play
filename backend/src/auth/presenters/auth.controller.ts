import { Body, Controller, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from '../application/auth.service';
import { InputLoginDto, InputRegisterDto } from '../application/dtos/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() inputRegisterDto: InputRegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.register(inputRegisterDto, res);
  }

  @Post('login')
  async login(
    @Body() inputLoginDto: InputLoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(inputLoginDto, res);
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res);
  }
}
