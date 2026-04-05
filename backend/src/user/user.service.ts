import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model, Types } from 'mongoose';
import { Subscription } from './subscription.schema';
import { Video } from '../video/video.schema';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { UserRepository } from './user.repository';
import { Room } from '../room/room.schema';
import type { Express } from 'express';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    @InjectModel(Video.name) private videoModel: Model<Video>,
    @InjectModel(Room.name) private roomModel: Model<Room>,
    @InjectModel(Subscription.name)
    private subscriptionModel: Model<Subscription>,
    private userRepository: UserRepository,
    private cloudinaryService: CloudinaryService,
  ) {}

  async toggleSubscribe(
    channelId: string,
    subscriberId: string,
    notification: 'none' | '' | 'all',
  ) {
    const existing = await this.userRepository.checkSubscriberExsiting(
      channelId,
      subscriberId,
    );
    if (existing) {
      if (notification !== '') {
        await this.subscriptionModel.updateOne(
          {
            subscriber: new Types.ObjectId(subscriberId),
            channel: new Types.ObjectId(channelId),
          },
          {
            $set: { notification },
          },
        );
      }
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

  async toggleReactionRoom(
    roomId: string,
    userId: string,
    type: 'like' | 'dislike',
  ) {
    const room = await this.roomModel.findById(roomId);
    if (!room) throw new NotFoundException('Room not found');

    const liked = room.likes.some((id) => id.toString() === userId);
    const disliked = room.dislikes.some((id) => id.toString() === userId);

    let updated;

    switch (type) {
      case 'like':
        if (liked) {
          updated = await this.roomModel.findByIdAndUpdate(
            roomId,
            { $pull: { likes: userId } },
            { new: true },
          );
        } else {
          updated = await this.roomModel.findByIdAndUpdate(
            roomId,
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
          updated = await this.roomModel.findByIdAndUpdate(
            roomId,
            { $pull: { dislikes: userId } },
            { new: true },
          );
        } else {
          updated = await this.roomModel.findByIdAndUpdate(
            roomId,
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

  async updateProfileChannel(
    userId: string,
    avatarUrl: Express.Multer.File,
    description: string,
  ) {
    const exisitingUser = await this.userModel.findById(userId);

    if (!exisitingUser) throw new NotFoundException('User not found');

    let newAvatarUrl = exisitingUser.avatarUrl;

    if (avatarUrl) {
      const uploadedImage = await this.cloudinaryService.uploadImage(avatarUrl);
      newAvatarUrl = uploadedImage.secure_url;
    }

    await this.userModel.findByIdAndUpdate(exisitingUser._id, {
      avatarUrl: newAvatarUrl,
      description: description !== '' && description,
    });

    return { message: 'Update channel successfully' };
  }

  async saveFcmToken(userId: string, fcmToken: string) {
    const saveFCMTOKEN = await this.userModel.findByIdAndUpdate(
      userId,
      {
        $addToSet: { fcmTokens: fcmToken },
      },
      { new: true },
    );
    if (saveFCMTOKEN) return saveFCMTOKEN;
    else throw new BadRequestException('Cant save fcm token');
  }
}
