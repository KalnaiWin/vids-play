import {
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { NotificationService } from './notification.service';
import { InputCreateNotification } from './notification.dto';

@Controller('notification')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @UseGuards(AuthGuard)
  @Post('/create')
  // @UseInterceptors(FileInterceptor('image'))
  async createNotification(@Body() data: InputCreateNotification) {
    if (!data.ownerId || data.ownerId)
      return { message: 'ChannelId or RefId not found' };
    return this.notificationService.createNotification(data);
  }

  async getAllNotificationsFromChannel() {}

  async getAllNotificationsSent() {}
}
