import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Video } from 'src/video/domain/video.schema';

@Injectable()
export class VideoRepository {
  constructor(@InjectModel(Video.name) private videoModel: Model<Video>) {}

  async findAllVideos() {
    return await this.videoModel.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'owner',
          foreignField: '_id',
          as: 'owner',
        },
      },
      {
        $unwind: '$owner',
      },
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          'owner._id': 1,
          'owner.name': 1,
          'owner.avatarUrl': 1,
          duration: 1,
          thumbnailUrl: 1,
          videoUrl: 1,
          visibility: 1,
          viewCount: 1,
          likeCount: 1,
          dislikeCount: 1,
          createdAt: 1,
        },
      },
    ]);
  }

  async getDetailWatchingVideo(videoId: string) {
    return (
      (
        await this.videoModel.aggregate([
          {
            $match: {
              _id: new mongoose.Types.ObjectId(videoId),
            },
          },
          {
            $lookup: {
              from: 'users',
              localField: 'owner',
              foreignField: '_id',
              as: 'owner',
            },
          },
          {
            $unwind: '$owner',
          },
          {
            $project: {
              _id: 1,
              title: 1,
              description: 1,
              'owner._id': 1,
              'owner.name': 1,
              'owner.avatarUrl': 1,
              'owner.subscriptions': 1,
              thumbnailUrl: 1,
              videoUrl: 1,
              visibility: 1,
              viewCount: 1,
              likeCount: 1,
              dislikeCount: 1,
              createdAt: 1,
            },
          },
        ])
      )[0] || null
    );
  }

  async getRandomVideos(limit: number, videoId: string) {
    return await this.videoModel.aggregate([
      {
        $match: {
          _id: { $ne: new mongoose.Types.ObjectId(videoId) },
          visibility: 'PUBLIC',
        },
      },
      {
        $sample: { size: limit },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'owner',
          foreignField: '_id',
          as: 'owner',
        },
      },
      {
        $unwind: '$owner',
      },
      {
        $project: {
          _id: 1,
          title: 1,
          thumbnailUrl: 1,
          viewCount: 1,
          duration: 1,
          createdAt: 1,
          'owner._id': 1,
          'owner.name': 1,
          'owner.avatarUrl': 1,
        },
      },
    ]);
  }
}
