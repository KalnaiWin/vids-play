import { Module } from '@nestjs/common';
import { CommentModule } from 'src/comment/comment.module';
import { RoomModule } from 'src/room/room.module';

@Module({
  imports: [RoomModule, CommentModule],
  providers: [],
})
export class SocketModule {}
