import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { UserSchema } from 'src/user/user.schema';
import { VideoModule } from 'src/video/video.module';
import { VideoSchema } from 'src/video/video.schema';
import { HistoryController } from './history.controller';
import { HistorySerice } from './history.service';
import { HistoryRepository } from './history.repository';
import { HistorySchema } from './history.schema';

@Module({
  imports: [
    AuthModule,
    UserModule,
    VideoModule,
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema,
      },
      {
        name: 'Video',
        schema: VideoSchema,
      },
      {
        name: 'History',
        schema: HistorySchema,
      },
    ]),
  ],
  controllers: [HistoryController],
  providers: [HistorySerice, HistoryRepository],
  exports: [HistorySerice],
})
export class HistoryModule {}
