import { VideoRepository } from './video.repository';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import type { Request } from 'express';
import { VideoInputUpload } from './video.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { UserService } from 'src/user/user.service';
import { log } from 'console';
import { VideoService } from './video.service';

@Controller('video')
export class VideoController {
  constructor(
    private videoService: VideoService,
    private videoRepository: VideoRepository,
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
  async getAllVideosForSpecificUser(
    @Param('id') userId: string,
    @Query('name') nameVideo: string,
  ) {
    if (!userId) return { message: 'UserId not found' };
    return await this.videoService.getAllVideosForSpecificUser(
      userId,
      nameVideo,
    );
  }

  @UseGuards(AuthGuard)
  @Get('liked')
  async likedVideo(@Req() req: Request) {
    const userId = req.user?.userId;
    if (!userId) return { message: 'UserId not found' };
    return await this.videoRepository.likedVideo(String(userId));
  }

  @Get(':id')
  async watchVideo(@Param('id') videoId: string) {
    if (!videoId) return { message: 'Video not found' };
    return await this.videoService.watchVideo(String(videoId));
  }

  @UseGuards(AuthGuard)
  @Delete('delete/:id')
  async deleteVideo(@Param('id') videoId: string, @Req() req: Request) {
    const userId = req.user?.userId;
    if (!videoId || !userId) return { message: 'UserId or VideoId not found' };
    await this.videoService.deleteVideo(userId, videoId);
    return videoId;
  }

  @UseGuards(AuthGuard)
  @Put('update/:id')
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
  async updateVideo(
    @Param('id') videoId: string,
    @Req() req: Request,
    @Body() data: VideoInputUpload,
    @UploadedFiles()
    files: {
      thumbnail?: Express.Multer.File[];
      video?: Express.Multer.File[];
    },
  ) {
    const userId = req.user?.userId;
    if (!videoId || !userId) return { message: 'UserId or VideoId not found' };
    await this.videoService.updateVideo(userId, videoId, data, files);
  }
}
