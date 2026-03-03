import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { BlogSchema } from 'src/blog/blog.schema';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { UserModule } from 'src/user/user.module';
import { UserSchema } from 'src/user/user.schema';
import { VideoSchema } from 'src/video/video.schema';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { VideoModule } from 'src/video/video.module';
import { CommentSchema } from './comment.schema';
import { CommentRepository } from './comment.repository';

@Module({
  imports: [
    AuthModule,
    UserModule,
    VideoModule,
    CloudinaryModule,
    MongooseModule.forFeature([
      {
        name: 'Comment',
        schema: CommentSchema,
      },
      {
        name: 'User',
        schema: UserSchema,
      },
      {
        name: 'Blog',
        schema: BlogSchema,
      },
      {
        name: 'Video',
        schema: VideoSchema,
      },
    ]),
  ],
  controllers: [CommentController],
  providers: [CommentService, CommentRepository],
  exports: [CommentService],
})
export class CommentModule {}
