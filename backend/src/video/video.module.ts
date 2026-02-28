import { Module } from '@nestjs/common';
import { VideoController } from './video.controller';
import { VideoRepository } from './video.repository';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { MongooseModule } from '@nestjs/mongoose';
import { VideoSchema } from './video.schema';
import { UserSchema } from 'src/user/user.schema';
import { MulterModule } from '@nestjs/platform-express';
import multer from 'multer';
import { TypeSchema } from './type.schema';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { SubscriptionSchema } from 'src/user/subscription.schema';
import { VideoService } from './video.service';
import { ScheduleService } from 'src/schedule/schedule.service';

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
    ]),
  ],
  controllers: [VideoController],
  providers: [
    VideoService,
    VideoRepository,
    CloudinaryService,
    ScheduleService,
  ],
  exports: [VideoRepository],
})
export class VideoModule {}
