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
import { AuthService } from '../application/auth.service';
import { InputLoginDto, InputRegisterDto } from '../application/dtos/auth.dto';
import { AuthGuard } from '../guard/auth.guard';

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

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res);
  }

  @Get('refresh')
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.refreshToken(req, res);
  }
}
