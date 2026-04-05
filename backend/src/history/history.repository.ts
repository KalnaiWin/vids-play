import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from '../user/user.schema';
import { Video } from '../video/video.schema';
import { History } from './history.schema';

@Injectable()
export class HistoryRepository {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Video.name) private videoModel: Model<Video>,
    @InjectModel(History.name) private historyModel: Model<History>,
  ) {}

  async getHistoryWatchedVideos(userId: string) {
    return await this.historyModel.aggregate([
      {
        $match: {
          user: new Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'owner',
        },
      },
      { $unwind: '$owner' },
      {
        $lookup: {
          from: 'videos',
          localField: 'video',
          foreignField: '_id',
          as: 'video',
        },
      },
      { $unwind: '$video' },
      {
        $project: {
          _id: 1,
          'owner._id': 1,
          'owner.name': 1,
          'owner.avatarUrl': 1,
          'video._id': 1,
          'video.thumbnailUrl': 1,
          'video.title': 1,
          'video.viewCount': 1,
          duration: 1,
          progress: 1,
          updatedAt: 1,
        },
      },
      {
        $sort: { updatedAt: -1 },
      },
    ]);
  }
}
