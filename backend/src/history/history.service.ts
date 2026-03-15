import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { HistoryRepository } from './history.repository';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/user/user.schema';
import { Model, Types } from 'mongoose';
import { Video } from 'src/video/video.schema';
import { History } from './history.schema';

@Injectable()
export class HistorySerice {
  constructor(
    private historyRepository: HistoryRepository,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Video.name) private videoModel: Model<Video>,
    @InjectModel(History.name) private historyModel: Model<History>,
  ) {}

  async pushWatchedVideo(videoId: string, userId: string) {
    const existingUser = await this.userModel.findById(userId);
    if (!existingUser) throw new NotFoundException('User not found');

    const existingVideo = await this.videoModel.findById(videoId);
    if (!existingVideo) throw new NotFoundException('Video not found');

    const history = await this.historyModel.findOneAndUpdate(
      {
        user: new Types.ObjectId(userId),
        video: new Types.ObjectId(videoId),
      },
      {
        $set: { updatedAt: new Date() },
        $setOnInsert: {
          duration: existingVideo.duration,
          user: new Types.ObjectId(userId),
          video: new Types.ObjectId(videoId),
        },
      },
      {
        upsert: true,
        new: true,
      },
    );

    return history;
  }

  async deleteWatchedVideo(userId: string, historyId: string) {
    const existingUser = await this.userModel.findById(userId);
    if (!existingUser) throw new NotFoundException('User not found');

    const existingWatchedVideo = await this.historyModel.findById(historyId);
    if (!existingWatchedVideo) throw new NotFoundException('Video not found');

    if (String(existingWatchedVideo.user._id) !== userId)
      throw new ForbiddenException('Only owner of account can delete');

    const deletedHistory = await this.historyModel.findOneAndDelete({
      _id: new Types.ObjectId(historyId),
      user: new Types.ObjectId(userId),
    });

    if (!deletedHistory)
      throw new NotFoundException('History not found or not authorized');

    return deletedHistory._id;
  }
}
