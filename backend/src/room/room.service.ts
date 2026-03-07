import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/user/user.schema';
import { Room } from './room.schema';
import { Model, Types } from 'mongoose';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class RoomService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Room.name) private roomModel: Model<Room>,
    private cloudinarySerice: CloudinaryService,
  ) {}

  async createRoom(
    userId: string,
    thumbail: Express.Multer.File,
    title: string,
  ) {
    const existingUser = await this.userModel.findById(userId).select('_id');
    if (!existingUser) throw new NotFoundException('User not found');

    if (title === '')
      throw new BadRequestException('Title should not be empty');

    const uploadImage = thumbail
      ? await this.cloudinarySerice.uploadImage(thumbail)
      : null;

    const newRoom = await this.roomModel.create({
      title: title,
      host: new Types.ObjectId(existingUser._id),
      thumbnail: uploadImage?.secure_url ?? '',
      startedAt: new Date(),
    });

    await newRoom.save();

    return newRoom;
  }

  async joiningRoom(userId: string, roomId: string) {
    const room = await this.roomModel.findByIdAndUpdate(
      roomId,
      { $inc: { viewCount: 1 } },
      { new: true },
    );

    if (!room) throw new NotFoundException('Room not found');

    const result = await this.roomModel
      .findById(roomId)
      .select('_id title totalViews host')
      .populate({
        path: 'host',
        select: '_id name avatarUrl',
      });

    return result;
  }
}
