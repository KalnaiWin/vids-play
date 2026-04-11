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
import * as mediasoup from 'mediasoup';
import { AccessToken } from 'livekit-server-sdk';

// @WebSocketGateway(8001, { cors: '*' })
@WebSocketGateway({ cors: { origin: process.env.CLIENT_URL } })
export class LivestreamGateway {
  @WebSocketServer()
  server!: Server;

  private logger: Logger = new Logger('CommentGateWay');
  private roomMessages: Map<string, ChatInput[]> = new Map();
  private cameraEnabled: any;
  private activeRooms: Set<string> = new Set();

  async handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
    this.server.emit('connect-success', client.id);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    client.rooms.forEach((roomId) => {
      client.leave(roomId);
      this.logger.log(`Client ${client.id} left room ${roomId}`);
    });
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
    if (this.activeRooms.has(roomId)) {
      client.emit('start-stream', { roomId });
    }
    client.to(roomId).emit('previous-messages', previousMessages);
  }

  @SubscribeMessage('left-room')
  leftRoom(@MessageBody() roomId: string, @ConnectedSocket() client: Socket) {
    client.leave(roomId);
  }

  @SubscribeMessage('camera-toggle')
  cameraToggle(
    @MessageBody() { roomId, enabled }: { roomId: string; enabled: boolean },
    @ConnectedSocket() client: Socket,
  ) {
    this.cameraEnabled = enabled;
    client.to(roomId).emit('camera-toggle', { enabled });
  }

  // Generate token for host
  @SubscribeMessage('get-host-token')
  async getHostToken(
    @MessageBody() { roomId }: { roomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const at = new AccessToken(
      process.env.LIVEKIT_API_KEY,
      process.env.LIVEKIT_API_SECRET,
      { identity: `host-${client.id}` },
    );

    at.addGrant({
      roomJoin: true,
      room: roomId,
      canPublish: true,
      canSubscribe: true,
    });

    return { token: await at.toJwt() };
  }

  // Generate token for viewer
  @SubscribeMessage('get-viewer-token')
  async getViewerToken(
    @MessageBody() { roomId }: { roomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const at = new AccessToken(
      process.env.LIVEKIT_API_KEY,
      process.env.LIVEKIT_API_SECRET,
      { identity: `viewer-${client.id}` },
    );

    at.addGrant({
      roomJoin: true,
      room: roomId,
      canPublish: false,
      canSubscribe: true,
    });

    return { token: await at.toJwt() };
  }

  // Keep your existing room events
  @SubscribeMessage('stream-ended')
  streamEnd(@MessageBody() { roomId }: { roomId: string }) {
    this.activeRooms.delete(roomId); 
    this.roomMessages.delete(roomId); 
    this.server.to(roomId).emit('stream-ended');
  }

  @SubscribeMessage('start-stream')
  startStream(@MessageBody() { roomId }: { roomId: string }) {
    this.activeRooms.add(roomId);
    this.server.to(roomId).emit('start-stream');
  }
}
