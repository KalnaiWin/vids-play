import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import type { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from './user.schema';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';

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

  @UseGuards(AuthGuard)
  @Get('channel/:id')
  async fetchChannelUser(@Param('id') channelId: string) {
    if (!mongoose.Types.ObjectId.isValid(channelId)) {
      throw new BadRequestException('Invalid channel id');
    }
    return await this.userRepository.findUserChannel(channelId);
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('avatarUrl'))
  @Put('channel')
  async updateProfileChannel(
    @Req() req: Request,
    @UploadedFile() avatar: Express.Multer.File,
    @Body('description') description: string,
  ) {
    const userId = req.user?.userId;
    if (!userId) throw new BadRequestException('Invalid user id');
    return this.userService.updateProfileChannel(userId, avatar, description);
  }
}
