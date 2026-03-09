import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { RoomService } from './room.service';

@WebSocketGateway({
  cors: true,
})
export class RoomGateway {

  constructor(private readonly roomService: RoomService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('join-room')
  async joinRoom(
    @MessageBody() roomId: string,
    @ConnectedSocket() client: Socket,
  ) {
    // client.join(roomId);
    // this.roomService.joiningRoom()
  }
}