import { Module } from '@nestjs/common';
import { RoomModule } from 'src/room/room.module';
import { MediasoupService } from './mediasoup.service';

@Module({
  imports: [RoomModule],
  providers: [MediasoupService],
  exports: [MediasoupService, RoomModule],
})
export class MediasoupModule {}
