import { Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../user/user.schema';
import { BlogRepository } from './blog.repository';
import { BlogSchema } from './blog.schema';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { VideoModule } from '../video/video.module';
import { BlogService } from './blog.service';
import { NotificationModule } from '../notification/notification.module';
import { FirebaseAdminModule } from '../firebase/firebase.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    CloudinaryModule,
    VideoModule,
    NotificationModule,
    FirebaseAdminModule,
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
