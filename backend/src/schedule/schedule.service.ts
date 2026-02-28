import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { Video } from 'src/video/video.schema';

@Injectable()
export class ScheduleService {
  constructor(@InjectModel(Video.name) private videoModel: Model<Video>) {}

    @Cron('0 */30 * * * *')
  async publishScheduledVideos() {
    const now = new Date();

    const videos = await this.videoModel.find({
      $expr: {
        $gte: ['$createdAt', '$scheduledAt'],
      },
      visibility: 'PRIVATE',
    });

    for (const video of videos) {
      video.visibility = 'PUBLIC';
      await video.save();
    }
  }
}
