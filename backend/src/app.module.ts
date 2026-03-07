import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from './config/config';
import { VideoModule } from './video/video.module';
import { AuthModule } from './auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { BlogModule } from './blog/blog.module';
import { CommentModule } from './comment/comment.module';
import { RoomModule } from './room/room.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: '.env',
      load: [config],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config) => ({
        uri: config.get('database.connectionString'),
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    CloudinaryModule,
    AuthModule,
    VideoModule,
    BlogModule,
    CommentModule,
    RoomModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
