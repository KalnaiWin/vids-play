import { Injectable } from '@nestjs/common';
import { Room } from './room.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class RoomRepository {
  constructor(@InjectModel(Room.name) private roomModel: Model<Room>) {}

  async findAllStreamRooms() {
    return await this.roomModel.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'host',
          foreignField: '_id',
          as: 'host',
        },
      },
      {
        $unwind: '$host',
      },
      {
        $project: {
          _id: 1,
          host: {
            'host._id': 1,
            'host.name': 1,
            'host.avatarUrl': 1,
          },
          title: 1,
          thumbnail: 1,
          totalViews: 1,
          startedAt: 1,
          endedAt: 1,
          status: 1,
        },
      },
    ]);
  }

  async getStreamingRoomsOfUser(userId: string) {
    return await this.roomModel.aggregate([
      {
        $match: {
          host: new Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'host',
          foreignField: '_id',
          as: 'host',
        },
      },
      {
        $unwind: '$host',
      },
      {
        $project: {
          _id: 1,
          host: {
            'host._id': 1,
            'host.name': 1,
            'host.avatarUrl': 1,
          },
          title: 1,
          thumbnail: 1,
          totalViews: 1,
          startedAt: 1,
          endedAt: 1,
          status: 1,
        },
      },
    ]);
  }
}
