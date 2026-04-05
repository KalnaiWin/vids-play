import { Module } from '@nestjs/common';
import { VideoController } from './video.controller';
import { VideoRepository } from './video.repository';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { MongooseModule } from '@nestjs/mongoose';
import { VideoSchema } from './video.schema';
import { UserSchema } from '../user/user.schema';
import { MulterModule } from '@nestjs/platform-express';
import multer from 'multer';
import { TypeSchema } from '../utils/type.schema';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { SubscriptionSchema } from '../user/subscription.schema';
import { VideoService } from './video.service';
import { ScheduleService } from '../schedule/schedule.service';
import { BlogRepository } from '../blog/blog.repository';
import { BlogSchema } from '../blog/blog.schema';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    MulterModule.register({
      storage: multer.memoryStorage(),
      limits: {
        fileSize: 100 * 1024 * 1024,
      },
    }),
    AuthModule,
    UserModule,
    NotificationModule,
    MongooseModule.forFeature([
      {
        name: 'Video',
        schema: VideoSchema,
      },
      {
        name: 'User',
        schema: UserSchema,
      },
      {
        name: 'Type',
        schema: TypeSchema,
      },
      {
        name: 'Subscription',
        schema: SubscriptionSchema,
      },
      {
        name: 'Blog',
        schema: BlogSchema,
      },
    ]),
  ],
  controllers: [VideoController],
  providers: [
    VideoService,
    VideoRepository,
    CloudinaryService,
    ScheduleService,
    BlogRepository,
  ],
  exports: [VideoRepository],
})
export class VideoModule {}
