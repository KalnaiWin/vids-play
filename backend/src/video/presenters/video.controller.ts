import {
  Body,
  Controller,
  Post,
  Req,
  // UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { VideoService } from '../application/video.service';
import type { Request } from 'express';
import { VideoInputUpload } from '../application/dtos/video.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import {
  FileFieldsInterceptor,
  // FileInterceptor,
} from '@nestjs/platform-express';
import { CloudinaryService } from '../application/cloudinary.service';

@Controller('video')
export class VideoController {
  constructor(
    private videoService: VideoService,
    private cloudinarySerice: CloudinaryService,
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
    return this.videoService.postNewVideo(
      userId,
      data,
      files.thumbnailUrl[0],
      files.videoUrl[0],
    );
  }
}
