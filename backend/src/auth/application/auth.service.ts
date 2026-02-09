import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthRepository } from './port/auth.repository';
import { InputLoginDto, InputRegisterDto, UserPayload } from './dtos/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { User } from 'src/user/domain/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async register(data: InputRegisterDto, res: Response) {
    const { name, email, password } = data;
    if (!name || !email || !password)
      throw new BadRequestException('Missing required fields');

    const existingUser = await this.userModel.findOne({ email: email });
    if (existingUser)
      throw new BadRequestException('Email has been already taken');

    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);

    const newUser = await this.userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    this.generateTokenAuth(String(newUser._id), res);

    return { message: 'Register successfully' };
  }

  async login(data: InputLoginDto, res: Response) {
    const { email, password } = data;
    const existingUser = await this.userModel
      .findOne({ email: email })
      .select('password');
    if (!existingUser) throw new UnauthorizedException('User not found');

    const isMatchedPassword = await bcrypt.compare(
      password,
      existingUser.password,
    );

    if (!isMatchedPassword)
      throw new UnauthorizedException('Invalid credentials');

    this.generateTokenAuth(String(existingUser._id), res);

    return { message: 'Login successfully' };
  }

  generateAccessToken(userId: string) {
    return this.jwtService.sign({ userId, type: 'access' });
  }

  generateRefreshToken(userId: string) {
    const refreshToken = this.jwtService.sign(
      { userId, type: 'refresh' },
      {
        secret: this.configService.get('jwt.refresh.secret'),
        expiresIn: this.configService.get('jwt.refresh.expiresIn'),
      },
    );
    return refreshToken;
  }

  generateTokenAuth(userId: string, res: Response) {
    const accessToken = this.generateAccessToken(String(userId));
    const refreshToken = this.generateRefreshToken(String(userId));
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: false, // change true in production
      sameSite: 'none',
      path: '/',
    });
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'none',
      path: '/',
    });
  }

  async logout(res: Response) {
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: 'none' as const,
      path: '/',
    };

    res.clearCookie('access_token', cookieOptions);
    res.clearCookie('refresh_token', cookieOptions);

    return { message: 'Logout successfully' };
  }

  verifyAccessToken(token: string): UserPayload {
    try {
      return this.jwtService.verify<UserPayload>(token, {
        secret: this.configService.get<string>('jwt.access.secret'),
      });
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }

  verifyRefreshToken(token: string): UserPayload {
    try {
      return this.jwtService.verify<UserPayload>(token, {
        secret: this.configService.get<string>('jwt.refresh.secret'),
      });
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }

  refreshToken(req: Request, res: Response) {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) throw new UnauthorizedException('Missing refresh token');
    const decoded = this.verifyRefreshToken(refreshToken);
    if (!decoded) throw new UnauthorizedException('Invalid refresh token');
    return this.generateTokenAuth(decoded.id, res);
  }
}
