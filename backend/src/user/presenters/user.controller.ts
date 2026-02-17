import { UserRepository } from './../application/port/user.repository';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../domain/user.schema';
import { Model } from 'mongoose';
import { UserService } from '../application/user.service';
import type { Request } from 'express';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@Controller('user')
export class UserController {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private userService: UserService,
    private userRepository: UserRepository,
  ) {}

  @UseGuards(AuthGuard)
  @Get('subscription')
  async getUserSubscription(@Req() req: Request) {
    const subscriberId = req.user?.userId;
    if (!subscriberId) return { message: 'SubscriberId not found' };
    return await this.userService.getUserSubscription(subscriberId);
  }

  @UseGuards(AuthGuard)
  @Post('subscribe/:id')
  async toggleSubscribe(
    @Param('id') channelId: string,
    @Req() req: Request,
    @Body('notification') notification: 'none' | '' | 'all',
  ) {
    const subscriberId = req.user?.userId;
    
    if (!subscriberId || !channelId)
      return { message: 'ChannelId or SubscriberId is not found' };
    else if (subscriberId === channelId)
      return { message: 'Can not subscribe your self' };
    return await this.userService.toggleSubscribe(
      channelId,
      subscriberId,
      notification,
    );
  }
}
