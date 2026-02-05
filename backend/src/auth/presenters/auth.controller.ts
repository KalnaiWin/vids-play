import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { InputLoginDto, InputRegisterDto } from '../application/dtos/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() inputRegisterDto: InputRegisterDto) {
    return this.authService.register(inputRegisterDto);
  }

  @Post('login')
  async login(@Body() inputLoginDto: InputLoginDto) {
    return this.authService.login(inputLoginDto);
  }
}
