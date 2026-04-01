import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { NotificationService } from './notification.service';
import { InputCreateNotification } from './notification.dto';
import type { Request } from 'express';
import { NotificationRepository } from './notification.repository';

@Controller('notification')
export class NotificationController {
  constructor(
    private notificationService: NotificationService,
    private notificationRepository: NotificationRepository,
  ) {}

  @UseGuards(AuthGuard)
  @Post('/create')
  async createNotification(@Body() data: InputCreateNotification) {
    if (!data.ownerId || !data.refId)
      return { message: 'ChannelId or RefId not found' };
    return this.notificationService.createNotification(data);
  }

  @UseGuards(AuthGuard)
  @Get('/')
  async getAllNotificationsOfUser(@Req() req: Request) {
    const userId = req.user?.userId;
    if (!userId) return { message: 'UserId not found' };
    return await this.notificationRepository.getAllNotificationsOfUser(userId);
  }

  @UseGuards(AuthGuard)
  @Get('/not-read')
  async checkNotReadNotification(@Req() req: Request) {
    const userId = req.user?.userId;
    if (!userId) return { message: 'UserId not found' };
    return await this.notificationRepository.hasUnreadNotification(userId);
  }

  @UseGuards(AuthGuard)
  @Put('/:id')
  async checkReadNotification(
    @Req() req: Request,
    @Param('id') notificationId: string,
  ) {
    const userId = req.user?.userId;
    if (!userId || !notificationId)
      return { message: 'UserId or NotificationId not found' };
    return await this.notificationService.checkReadNotification(
      userId,
      notificationId,
    );
  }
}
