// streaming.gateway.ts
import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AccessToken } from 'livekit-server-sdk';

@WebSocketGateway({ cors: { origin: '*' } })
export class StreamingGateway {
  @WebSocketServer()
  server: Server;

  
}