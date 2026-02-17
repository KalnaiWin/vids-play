import { Module } from '@nestjs/common';
import { VideoController } from './presenters/video.controller';
import { VideoService } from './application/video.service';
import { VideoRepository } from './application/port/video.repository';
import { CloudinaryService } from './application/cloudinary.service';
import { MongooseModule } from '@nestjs/mongoose';
import { VideoSchema } from './domain/video.schema';
import { UserSchema } from 'src/user/domain/user.schema';
import { MulterModule } from '@nestjs/platform-express';
import multer from 'multer';
import { TypeSchema } from './domain/type.schema';
import { AuthModule } from 'src/auth/presenters/auth.module';
import { UserService } from 'src/user/application/user.service';
import { UserModule } from 'src/user/user.module';
import { SubscriptionSchema } from 'src/user/application/subscription.schema';

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
  providers: [VideoService, VideoRepository, CloudinaryService],
  exports: [VideoRepository],
})
export class VideoModule {}
