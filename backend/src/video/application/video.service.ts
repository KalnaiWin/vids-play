import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Req,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Video } from '../domain/video.schema';
import { Model } from 'mongoose';
import { VideoInputUpload } from './dtos/video.dto';
import { User } from 'src/user/domain/user.schema';
import { CloudinaryService } from './cloudinary.service';
import { VideoRepository } from './port/video.repository';

@Injectable()
export class VideoService {
  constructor(
    @InjectModel(Video.name) private videoModel: Model<Video>,
    @InjectModel(User.name) private userModel: Model<User>,
    private cloudinaryService: CloudinaryService,
    private videoRepository: VideoRepository,
  ) {}

  async postNewVideo(
    userId: string,
    data: VideoInputUpload,
    thumbnail: Express.Multer.File,
    video: Express.Multer.File,
  ) {
    const existingUser = await this.userModel.findById(userId);
    if (!existingUser) throw new NotFoundException('User not found');

    const allowedVisibility = ['PUBLIC', 'UNLISTED', 'PRIVATE'];

    if (!allowedVisibility.includes(data.visibility)) {
      throw new BadRequestException('Invalid visibility');
    }

    if (!thumbnail || !video) {
      throw new BadRequestException('Thumbnail and video are required');
    }

    const uploadedImage = await this.cloudinaryService.uploadImage(thumbnail);
    const uploadedVideo = await this.cloudinaryService.uploadVideo(video);

    if (!uploadedVideo || !uploadedImage)
      throw new InternalServerErrorException('Upload failed');

    const typeIds = await this.videoRepository.findOrCreateNewType(data.types);

    await this.videoModel.create({
      owner: existingUser._id,
      title: data.title,
      description: data.description?.trim() || undefined,
      duration: data.duration,
      visibility: data.visibility,
      types: typeIds,
      videoUrl: uploadedVideo.secure_url,
      thumbnailUrl: uploadedImage.secure_url,
    });

    return { message: 'Upload video successfully' };
  }

  async getAllVideos() {
    return await this.videoRepository.findAllVideos();
  }

  async watchVideo(videoId: string) {
    return this.videoRepository.getDetailWatchingVideo(videoId);
  }

  async getRandomVideosForRecommend(videoId: string) {
    return this.videoRepository.getRandomVideos(10, videoId);
  }

  async countViewVideo(videoId: string) {
    return await this.videoModel.findByIdAndUpdate(
      videoId,
      { $inc: { viewCount: 1 } },
      { new: true },
    );
  }
}
