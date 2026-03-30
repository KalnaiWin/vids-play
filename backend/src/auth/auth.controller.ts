import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { InputLoginDto, InputRegisterDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard)
  @Get('me')
  async getUser(@Req() req: Request) {
    const userId = req.user?.userId;
    if (!userId) return { message: 'UserId not found' };
    return this.authService.getUser(String(userId));
  }

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

  @UseGuards(AuthGuard)
  @Post('logout')
  async logout(
    @Req() req: any,
    @Body('fcmToken') fcmToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userId = req.user?.userId;
    if (!userId) return { message: 'Have an account to log out' };
    return this.authService.logout(userId, fcmToken, res);
  }

  @Get('refresh')
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.refreshToken(req, res);
  }
}
