import {
  BadRequestException,
  Injectable,
  NotFoundException,
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

  async getUser(userId: string) {
    const exsitingUser = await this.userModel
      .findById(userId)
      .select('name email avatarUrl');
    if (!exsitingUser) throw new NotFoundException('User not found');
    return exsitingUser;
  }

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

    return {
      success: true,
      message: 'Register successfully',
      user: {
        name: newUser.name,
        email: newUser.email,
      },
    };
  }

  async login(data: InputLoginDto, res: Response) {
    const { email, password } = data;
    const existingUser = await this.userModel
      .findOne({ email: email })
      .select('password name email');
    if (!existingUser) throw new UnauthorizedException('User not found');

    const isMatchedPassword = await bcrypt.compare(
      password,
      existingUser.password,
    );

    if (!isMatchedPassword)
      throw new UnauthorizedException('Invalid credentials');

    this.generateTokenAuth(String(existingUser._id), res);

    return {
      success: true,
      message: 'Login successfully',
      user: {
        name: existingUser.name,
        email: existingUser.email,
      },
    };
  }

  generateAccessToken(userId: string) {
    if (!userId) throw new BadRequestException('Invalid user ID');
    return this.jwtService.sign({ userId, type: 'access' });
  }

  generateRefreshToken(userId: string) {
    if (!userId) throw new BadRequestException('Invalid user ID');
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
    if (!userId) throw new BadRequestException('Invalid user ID');
    const accessToken = this.generateAccessToken(String(userId));
    const refreshToken = this.generateRefreshToken(String(userId));
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // change true in production
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/',
    });
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/',
    });
    return res.json({
      message: 'Token refreshed successfully',
      success: true,
    });
  }

  async logout(res: Response) {
    const cookieOptions = {
      httpOnly: true,
      secure: false,
      sameSite: 'lax' as const,
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
    return this.generateTokenAuth(decoded.userId, res);
  }
}
