import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { HistorySerice } from './history.service';
import { HistoryRepository } from './history.repository';
import { AuthGuard } from 'src/auth/auth.guard';
import type { Request } from 'express';

@Controller('history')
export class HistoryController {
  constructor(
    private historyService: HistorySerice,
    private historyRepository: HistoryRepository,
  ) {}

  @UseGuards(AuthGuard)
  @Post('/save-watched/:id')
  async pushWatchedVideo(
    @Param('id') videoId: string,
    @Req() request: Request,
  ) {
    const userId = request.user?.userId;
    if (!userId || !videoId) return { messgae: 'UserId or VideoId not found' };
    return await this.historyService.pushWatchedVideo(videoId, userId);
  }

  @UseGuards(AuthGuard)
  @Get('/')
  async getAllWatchedVideos(@Req() req: Request) {
    const userId = req.user?.userId;
    if (!userId) return { message: 'UserId not found' };
    return await this.historyRepository.getHistoryWatchedVideos(userId);
  }

  @UseGuards(AuthGuard)
  @Delete('del/:id')
  async deleteWatchedVideo(
    @Req() req: Request,
    @Param('id') historyId: string,
  ) {
    const userId = req.user?.userId;
    if (!userId || !historyId)
      return { message: 'UserId or historyId not found' };
    return await this.historyService.deleteWatchedVideo(userId, historyId);
  }
}
