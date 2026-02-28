import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { UserService } from './user.service';
import { Subscription, SubscriptionSchema } from './subscription.schema';
import { Video, VideoSchema } from 'src/video/video.schema';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';

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
    CloudinaryModule,
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService, UserRepository],
})
export class UserModule {}
