import { Module } from '@nestjs/common';
import { VideoController } from './presenters/video.controller';
import { VideoService } from './application/video.service';
import { VideoRepository } from './application/port/video.repository';
import { AuthModule } from 'src/auth/auth.module';
import { CloudinaryService } from './application/cloudinary.service';
import { MongooseModule } from '@nestjs/mongoose';
import { VideoSchema } from './domain/video.schema';
import { UserSchema } from 'src/user/domain/user.schema';
import { MulterModule } from '@nestjs/platform-express';
import multer from 'multer';
import { TypeSchema } from './domain/type.schema';

@Module({
  imports: [
    MulterModule.register({
      storage: multer.memoryStorage(),
      limits: {
        fileSize: 100 * 1024 * 1024,
      },
    }),
    AuthModule,
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
    ]),
  ],
  controllers: [VideoController],
  providers: [VideoService, VideoRepository, CloudinaryService],
  exports: [VideoRepository],
})
export class VideoModule {}
