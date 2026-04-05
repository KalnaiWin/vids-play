import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { Subscription } from 'rxjs';
import { User } from '../user/user.schema';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Subscription.name)
    private subscriptionModel: Model<Subscription>,
  ) {}
  async findUserSubscription(subscriberId: string) {
    return await this.subscriptionModel.aggregate([
      {
        $match: {
          subscriber: new mongoose.Types.ObjectId(subscriberId),
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'channel',
          foreignField: '_id',
          as: 'channel',
        },
      },
      {
        $unwind: '$channel',
      },
      {
        $project: {
          _id: 1,
          channelId: '$channel._id',
          name: '$channel.name',
          avatarUrl: '$channel.avatarUrl',
        },
      },
    ]);
  }

  async checkSubscriberExsiting(channelId: string, subscriberId: string) {
    return await this.subscriptionModel.findOne({
      channel: new Types.ObjectId(channelId),
      subscriber: new Types.ObjectId(subscriberId),
    });
  }

  async findUserChannel(userId: string) {
    return await this.userModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: 'videos',
          let: { userId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$owner', '$$userId'],
                },
                visibility: 'PUBLIC',
              },
            },
            {
              $group: {
                _id: null,
                totalVideoCount: { $sum: 1 },
                totalViews: { $sum: '$viewCount' },
              },
            },
          ],
          as: 'video',
        },
      },
      {
        $lookup: {
          from: 'subscriptions',
          let: { ownerId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$channel', '$$ownerId'],
                },
              },
            },
            {
              $project: {
                _id: 0,
                subscriber: 1,
              },
            },
          ],
          as: 'subscribers',
        },
      },
      {
        $addFields: {
          subscribers: {
            $map: {
              input: '$subscribers',
              as: 'sub',
              in: { $toString: '$$sub.subscriber' },
            },
          },
          totalVideoCount: {
            $ifNull: [{ $arrayElemAt: ['$video.totalVideoCount', 0] }, 0],
          },
          totalViews: {
            $ifNull: [{ $arrayElemAt: ['$video.totalViews', 0] }, 0],
          },
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          handleName: 1,
          avatarUrl: 1,
          description: 1,
          subscribers: 1,
          totalVideoCount: 1,
          totalViews: 1,
          createdAt: 1,
        },
      },
    ]);
  }

  async getSubscribersOfChannelId(channelId: string) {
    return await this.subscriptionModel.aggregate([
      {
        $match: {
          channel: new Types.ObjectId(channelId),
        },
      },
      {
        $project: {
          _id: 0,
          subscriber: 1,
        },
      },
    ]);
  }
}
