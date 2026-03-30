import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InputCreateNotification } from './notification.dto';
import { User } from 'src/user/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Notification } from './notification.schema';
import { UserRepository } from 'src/user/user.repository';
import { FirebaseService } from 'src/firebase/firebase.service';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Notification.name)
    private notificationModel: Model<Notification>,
    private userRepository: UserRepository,
    // private firebaseService: FirebaseService,
  ) {}

  async createNotification(data: InputCreateNotification) {
    if (data.title === '' || !data.title)
      throw new BadRequestException('Title should not be empty');

    const exsitingAuthor = await this.userModel.findById(data.ownerId);
    if (!exsitingAuthor)
      throw new NotFoundException('AuthorId not found to create notification');

    const subscribers = await this.userRepository.getSubscribersOfChannelId(
      String(data.ownerId),
    );

    const newNotification = subscribers.map((subId) => ({
      sender: new Types.ObjectId(data.ownerId),
      receiver: new Types.ObjectId(subId),
      refId: new Types.ObjectId(data.refId),
      image: data.image,
      title: data.title,
    }));

    await this.notificationModel.insertMany(newNotification);
  }
}
