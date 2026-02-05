import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { AuthRepository } from './port/auth.repository';
import {
  InputLoginDto,
  InputRegisterDto,
  OutputAuthenticateDto,
} from './dtos/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async register(data: InputRegisterDto): Promise<OutputAuthenticateDto> {
    const { name, email, password } = data;
    if (!name || !email || !password)
      throw new BadRequestException('Missing required fields');

    const existingUser = await this.authRepository.findByEmail(email);
    if (existingUser) throw new ConflictException('Email already registered');

    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);

    const res = await this.authRepository.createAccount({
      name,
      email,
      password: hashedPassword,
    });

    return {
      name: res.name,
      email: res.email,
    };
  }

  async login(data: InputLoginDto): Promise<OutputAuthenticateDto> {
    const { email, password } = data;
    const existingUser = await this.authRepository.findByEmail(email);
    if (!existingUser) throw new BadRequestException('User not found');

    const isMatchedPassword = await bcrypt.compare(
      password,
      existingUser.password,
    );

    if (!isMatchedPassword)
      throw new BadRequestException('Invalid credentials');

    return {
      name: existingUser.name,
      email: existingUser.email,
    };
  }
}
