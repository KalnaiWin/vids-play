import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../domain/user.schema';
import { Model, Types } from 'mongoose';
import { UserRepository } from './port/user.repository';
import { Subscription } from './subscription.schema';
import { Video } from 'src/video/domain/video.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    @InjectModel(Video.name) private videoModel: Model<Video>,
    @InjectModel(Subscription.name)
    private subscriptionModel: Model<Subscription>,
    private userRepository: UserRepository,
  ) {}

  async getUserSubscription(subscriberId: string) {
    return await this.userRepository.findUserSubscription(subscriberId);
  }

  async toggleSubscribe(channelId: string, subscriberId: string) {
    const existing = await this.userRepository.checkSubscriberExsiting(
      channelId,
      subscriberId,
    );
    if (existing) {
      await this.subscriptionModel.deleteOne({
        _id: existing._id,
      });
      return { subscribed: false };
    }

    await this.subscriptionModel.create({
      subscriber: new Types.ObjectId(subscriberId),
      channel: new Types.ObjectId(channelId),
    });

    return { subscribed: true };
  }

  async toggleReactionVideo(
    videoId: string,
    userId: string,
    type: 'like' | 'dislike',
  ) {
    const video = await this.videoModel.findById(videoId);
    if (!video) throw new NotFoundException('Video not found');

    const liked = video.likes.some((id) => id.toString() === userId);
    const disliked = video.dislikes.some((id) => id.toString() === userId);

    let updated;

    switch (type) {
      case 'like':
        if (liked) {
          updated = await this.videoModel.findByIdAndUpdate(
            videoId,
            { $pull: { likes: userId } },
            { new: true },
          );
        } else {
          updated = await this.videoModel.findByIdAndUpdate(
            videoId,
            {
              $addToSet: { likes: userId },
              $pull: { dislikes: userId },
            },
            { new: true },
          );
        }
        break;

      case 'dislike':
        if (disliked) {
          updated = await this.videoModel.findByIdAndUpdate(
            videoId,
            { $pull: { dislikes: userId } },
            { new: true },
          );
        } else {
          updated = await this.videoModel.findByIdAndUpdate(
            videoId,
            {
              $addToSet: { dislikes: userId },
              $pull: { likes: userId },
            },
            { new: true },
          );
        }
        break;

      default:
        throw new BadRequestException('Invalid reaction type');
    }

    return {
      likes: updated!.likes,
      dislikes: updated!.dislikes,
    };
  }
}
