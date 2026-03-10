import { Module } from '@nestjs/common';
import { CommentModule } from 'src/comment/comment.module';
import { RoomModule } from 'src/room/room.module';
import { LivestreamGateway } from './livestream.gateway';

@Module({
  imports: [],
  providers: [LivestreamGateway],
})
export class SocketModule {}
