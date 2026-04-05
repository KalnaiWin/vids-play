import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { UserService } from './user.service';
import { Subscription, SubscriptionSchema } from './subscription.schema';
import { Video, VideoSchema } from '../video/video.schema';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { Room, RoomSchema } from '../room/room.schema';
import { RoomModule } from '../room/room.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Subscription.name,
        schema: SubscriptionSchema,
      },
      {
        name: Video.name,
        schema: VideoSchema,
      },
      {
        name: Room.name,
        schema: RoomSchema,
      },
    ]),
    CloudinaryModule,
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService, UserRepository],
})
export class UserModule {}
