import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from 'src/user/user.schema';
import { Video } from './video.schema';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { VideoRepository } from './video.repository';
import { VideoInputUpload } from './video.dto';
import { NotificationService } from 'src/notification/notification.service';
import type { Express } from 'express';

@Injectable()
export class VideoService {
  constructor(
    @InjectModel(Video.name) private videoModel: Model<Video>,
    @InjectModel(User.name) private userModel: Model<User>,
    private notificationService: NotificationService,
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

    let typeIds: Types.ObjectId[] | undefined;

    if (data.types?.length) {
      typeIds = await this.videoRepository.findOrCreateNewType(data.types);
    }

    const today = new Date();
    const scheduled = new Date(`${data.scheduleDate}T${data.scheduleTime}:00`);
    const scheduleData = scheduled >= today ? scheduled : null;

    const newVideo = await this.videoModel.create({
      owner: existingUser._id,
      title: data.title,
      description: data.description?.trim() || undefined,
      duration: data.duration,
      visibility: data.visibility,
      types: typeIds,
      videoUrl: uploadedVideo.secure_url,
      thumbnailUrl: uploadedImage.secure_url,
      scheduledAt: scheduleData,
    });

    await newVideo.save();

    await this.notificationService.createNotification({
      title: newVideo.title,
      ownerId: userId,
      refId: String(newVideo._id),
      image: newVideo.thumbnailUrl,
      type: 'VIDEO',
    });

    return newVideo;
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

    let typeIds: Types.ObjectId[] | undefined;

    if (data.types?.length) {
      typeIds = await this.videoRepository.findOrCreateNewType(data.types);
    }

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

    let scheduleData: Date | null = null;

    if (data.scheduleDate && data.scheduleTime) {
      const scheduled = new Date(
        `${data.scheduleDate}T${data.scheduleTime}:00`,
      );
      if (isNaN(scheduled.getTime())) {
        throw new BadRequestException('Invalid schedule date');
      }
      if (scheduled < new Date()) {
        throw new BadRequestException('Schedule time must be in the future');
      }
      scheduleData = scheduled;
    }

    const updatedvideo = await this.videoModel.findByIdAndUpdate(
      existingVideo._id,
      {
        title: data.title,
        description: data.description?.trim() || undefined,
        duration: data.duration,
        visibility: data.visibility,
        types: typeIds,
        videoUrl: newVideoUrl,
        thumbnailUrl: newThumbnailUrl,
        scheduledAt: scheduleData,
      },
      { new: true },
    );

    return updatedvideo;
  }
}
