import { Module } from '@nestjs/common';
import { PostController } from './blog.controller';
import { PostService } from './blog.service';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/user/user.schema';
import { PostRepository } from './blog.repository';
import { BlogSchema } from './blog.schema';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { VideoModule } from 'src/video/video.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    CloudinaryModule,
    VideoModule,
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema,
      },
      {
        name: 'Blog',
        schema: BlogSchema,
      },
    ]),
  ],
  controllers: [PostController],
  providers: [PostService, PostRepository],
  exports: [],
})
export class BlogModule {}
