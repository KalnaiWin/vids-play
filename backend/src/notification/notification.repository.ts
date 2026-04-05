import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from '../user/user.schema';
import { Notification } from './notification.schema';

@Injectable()
export class NotificationRepository {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Notification.name)
    private notificationModel: Model<Notification>,
  ) {}

  async getAllNotificationsOfUser(userId: string, page = 1, limit = 10) {
    return await this.notificationModel.aggregate([
      {
        $match: {
          receiver: new Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'sender',
          foreignField: '_id',
          as: 'owner',
        },
      },
      { $unwind: '$owner' },
      {
        $project: {
          _id: 1,
          ownerName: '$owner.name',
          avatar: '$owner.avatarUrl',
          image: 1,
          title: 1,
          isRead: 1,
          type: 1,
          refId: 1,
          createdAt: 1,
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ]);
  }

  async hasUnreadNotification(userId: string) {
    const exists = await this.notificationModel.exists({
      receiver: new Types.ObjectId(userId),
      isRead: false,
    });

    return !!exists;
  }
}
