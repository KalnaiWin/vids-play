import { Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/user/user.schema';
import { BlogRepository } from './blog.repository';
import { BlogSchema } from './blog.schema';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { VideoModule } from 'src/video/video.module';
import { BlogService } from './blog.service';

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
  controllers: [BlogController],
  providers: [BlogService, BlogRepository],
  exports: [],
})
export class BlogModule {}
