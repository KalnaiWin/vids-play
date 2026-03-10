import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { ChatInput } from '../comment/comment.dto';
import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway(8001, { cors: '*' })
export class LivestreamGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  private logger: Logger = new Logger('CommentGateWay');
  private roomMessages: Map<string, ChatInput[]> = new Map();

  afterInit(server: Server) {}

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    client.rooms.forEach((roomId) => {
      client.leave(roomId);
      this.logger.log(`Client ${client.id} left room ${roomId}`);
    });
  }

  getAllMessages() {
    return this.roomMessages;
  }

  @SubscribeMessage('send-message')
  handleSendMessage(client: Socket, message: ChatInput) {
    const messages = this.roomMessages.get(message.roomId) || [];
    messages.push(message);
    this.roomMessages.set(message.roomId, messages);
    this.server.in(message.roomId).emit('receive-message', message);
  }

  @SubscribeMessage('join-room')
  joinRoom(@MessageBody() roomId: string, @ConnectedSocket() client: Socket) {
    client.join(roomId);
    const previousMessages = this.roomMessages.get(roomId) || [];
    client.emit('previous-messages', previousMessages);
  }

  @SubscribeMessage('left-room')
  leftRoom(@MessageBody() roomId: string, @ConnectedSocket() client: Socket) {
    client.leave(roomId);
  }
}
