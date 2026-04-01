import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/user/user.schema';
import { Room } from './room.schema';
import { Model, Types } from 'mongoose';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class RoomService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Room.name) private roomModel: Model<Room>,
    private cloudinarySerice: CloudinaryService,
    private notificationService: NotificationService,
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

    await this.notificationService.createNotification({
      title: newRoom.title,
      ownerId: userId,
      refId: String(newRoom._id),
      image: newRoom.thumbnail,
      type: 'VIDEO',
    });

    return newRoom;
  }

  async editRoom(
    userId: string,
    thumbail: Express.Multer.File,
    title: string,
    roomId: string,
  ) {
    const existingUser = await this.userModel.findById(userId);
    if (!existingUser) throw new NotFoundException('User not found');

    const existingRoom = await this.roomModel.findById(roomId);
    if (!existingRoom) throw new NotFoundException('Room not found');

    if (String(existingRoom.host._id) !== userId)
      throw new ForbiddenException('Only author can change this');

    if (title === '' && existingRoom.title !== '')
      throw new BadRequestException('Title should not be empty');

    const uploadImage = thumbail
      ? await this.cloudinarySerice.uploadImage(thumbail)
      : null;

    const updatedRoom = await this.roomModel.findByIdAndUpdate(
      roomId,
      {
        title: title !== '' ? title : existingRoom.title,
        thumbnail: uploadImage?.secure_url ?? existingRoom.thumbnail,
      },
      { new: true },
    );

    return updatedRoom;
  }

  async deleteRoom(roomId: string, userId: string) {
    const existingUser = await this.userModel.findById(userId);
    if (!existingUser) throw new NotFoundException('User not found');

    const existingRoom = await this.roomModel.findById(roomId);
    if (!existingRoom) throw new NotFoundException('Room not found');

    if (String(existingRoom.host._id) !== userId)
      throw new ForbiddenException('Only author can change this');

    await this.roomModel.findByIdAndDelete(roomId);
    return roomId;
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

  async changeStatusRoom(
    userId: string,
    roomId: string,
    status: 'LIVE' | 'STOP' | 'WAITING',
  ) {
    const existingUser = await this.userModel.findById(userId);
    if (!existingUser) throw new NotFoundException('User not found');

    const existingRoom = await this.roomModel.findById(roomId);
    if (!existingRoom) throw new NotFoundException('Room not found');

    if (String(existingRoom.host._id) !== userId)
      throw new ForbiddenException('Only author can change this');

    let updatedStatusRoom;

    if (status === 'STOP') {
      updatedStatusRoom = await this.roomModel.findByIdAndUpdate(
        roomId,
        {
          status: status,
          endedAt: new Date(),
        },
        { new: true },
      );
    } else if (status === 'LIVE') {
      updatedStatusRoom = await this.roomModel.findByIdAndUpdate(
        roomId,
        {
          status: status,
          startedAt: new Date(),
        },
        { new: true },
      );
    }

    return updatedStatusRoom;
  }
}
