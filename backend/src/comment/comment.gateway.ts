import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { ChatInput } from './comment.dto';
import { Socket } from 'socket.io';

@WebSocketGateway(8001, { cors: '*' })
export class CommentGateway {
  @WebSocketServer()
  server;

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomId: string,
  ) {
    client.join(roomId);
  }

  @SubscribeMessage('message')
  handleSendMessage(@MessageBody() message: ChatInput) {
    console.log(message);
    this.server.emit('message', message);
  }
}
