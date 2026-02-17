import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { User } from 'src/user/domain/user.schema';
import { Subscription } from '../subscription.schema';

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
}
