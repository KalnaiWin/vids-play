import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { VideoService } from '../application/video.service';
import type { Request } from 'express';
import { VideoInputUpload } from '../application/dtos/video.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../application/cloudinary.service';
import { UserService } from 'src/user/application/user.service';

@Controller('video')
export class VideoController {
  constructor(
    private videoService: VideoService,
    private cloudinarySerice: CloudinaryService,
    private userService: UserService,
  ) {}

  @UseGuards(AuthGuard)
  @Post('upload')
  @UseInterceptors(
    FileFieldsInterceptor([
      {
        name: 'thumbnailUrl',
        maxCount: 1,
      },
      {
        name: 'videoUrl',
        maxCount: 1,
      },
    ]),
  )
  async uploadVideo(
    @Req() req: Request,
    @Body() data: VideoInputUpload,
    @UploadedFiles()
    files: {
      thumbnailUrl: Express.Multer.File[];
      videoUrl: Express.Multer.File[];
    },
  ) {
    const userId = req.user?.userId;
    if (!userId) return { message: 'UserId not found' };
    return await this.videoService.postNewVideo(
      userId,
      data,
      files.thumbnailUrl[0],
      files.videoUrl[0],
    );
  }

  @Get('/')
  async getAllVideos() {
    return await this.videoService.getAllVideos();
  }

  @Get('recommend/:id')
  async getRecommendedVideos(@Param('id') videoId: string) {
    if (!videoId) return { message: 'Video not found' };
    return await this.videoService.getRandomVideosForRecommend(videoId);
  }

  @Post('count-view/:id')
  async countViewVideo(@Param('id') videoId: string) {
    if (!videoId) return { message: 'Video not found' };
    return await this.videoService.countViewVideo(videoId);
  }

  @UseGuards(AuthGuard)
  @Post('reaction/:id')
  async toggleReactionVideo(
    @Param('id') videoId: string,
    @Req() req: Request,
    @Body('type') reaction: 'like' | 'dislike',
  ) {
    const userId = req.user?.userId;
    if (!userId) return { message: 'UserId not found' };

    return await this.userService.toggleReactionVideo(
      videoId,
      userId,
      reaction,
    );
  }

  @UseGuards(AuthGuard)
  @Get('manage/:id')
  async getAllVideosForSpecificUser(@Param('id') userId: string) {
    if (!userId) return { message: 'UserId not found' };
    return await this.videoService.getAllVideosForSpecificUser(userId);
  }

  @Get(':id')
  async watchVideo(@Param('id') videoId: string) {
    if (!videoId) return { message: 'Video not found' };
    return await this.videoService.watchVideo(String(videoId));
  }
}
