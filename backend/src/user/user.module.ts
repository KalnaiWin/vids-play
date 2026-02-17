import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './domain/user.schema';
import { UserController } from './presenters/user.controller';
import { UserService } from './application/user.service';
import { UserRepository } from './application/port/user.repository';
import {
  Subscription,
  SubscriptionSchema,
} from './application/subscription.schema';
import { Video, VideoSchema } from 'src/video/domain/video.schema';

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
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService, UserRepository],
})
export class UserModule {}
