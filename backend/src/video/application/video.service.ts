import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
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
    return await this.videoRepository.getDetailWatchingVideo(videoId);
  }

  async getRandomVideosForRecommend(videoId: string) {
    return await this.videoRepository.getRandomVideos(10, videoId);
  }

  async countViewVideo(videoId: string) {
    return await this.videoModel.findByIdAndUpdate(
      videoId,
      { $inc: { viewCount: 1 } },
      { new: true },
    );
  }

  async getAllVideosForSpecificUser(userId: string, nameVideo: string) {
    return await this.videoRepository.findAllVideosForSpecificUser(
      userId,
      nameVideo,
    );
  }

  async deleteVideo(userId: string, videoId: string) {
    const video = await this.videoModel.findById(videoId);
    if (!video) throw new NotFoundException('Video not found');
    if (String(video?.owner._id) !== userId)
      throw new ForbiddenException('Only author can delete this video');

    await this.videoModel.deleteOne({ _id: videoId });
    return { message: 'Deleted successfully' };
  }

  async updateVideo(
    userId: string,
    videoId: string,
    data: VideoInputUpload,
    files: {
      thumbnail?: Express.Multer.File[];
      video?: Express.Multer.File[];
    },
  ) {
    const existingUser = this.userModel.findById(userId);
    if (!existingUser) throw new NotFoundException('User not found');
    const existingVideo = await this.videoModel.findById(videoId);
    if (!existingVideo) throw new NotFoundException('Video not found');
    if (String(existingVideo.owner._id) !== userId)
      throw new ForbiddenException('Only author can edit this video');

    const allowedVisibility = ['PUBLIC', 'UNLISTED', 'PRIVATE'];

    if (!allowedVisibility.includes(data.visibility)) {
      throw new BadRequestException('Invalid visibility');
    }

    const typeIds = await this.videoRepository.findOrCreateNewType(data.types);

    let newThumbnailUrl = existingVideo.thumbnailUrl;
    let newVideoUrl = existingVideo.videoUrl;

    if (files?.thumbnail?.[0]) {
      const uploadedImage = await this.cloudinaryService.uploadImage(
        files.thumbnail[0],
      );
      newThumbnailUrl = uploadedImage.secure_url;
    }

    if (files?.video?.[0]) {
      const uploadedVideo = await this.cloudinaryService.uploadVideo(
        files.video[0],
      );
      newVideoUrl = uploadedVideo.secure_url;
    }

    await this.videoModel.findByIdAndUpdate(existingVideo._id, {
      title: data.title,
      description: data.description?.trim() || undefined,
      duration: data.duration,
      visibility: data.visibility,
      types: typeIds,
      videoUrl: newVideoUrl,
      thumbnailUrl: newThumbnailUrl,
    });

    return { message: 'Update video successfully' };
  }
}
