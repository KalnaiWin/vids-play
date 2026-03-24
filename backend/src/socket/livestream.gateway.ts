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

@WebSocketGateway(8001, { cors: '*' })
export class LivestreamGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  private logger: Logger = new Logger('CommentGateWay');
  private roomMessages: Map<string, ChatInput[]> = new Map();
  private worker: any;
  private router: any;
  private producerTransport: any;
  private producer: any;
  private consumerTransports: Map<string, any> = new Map();
  private consumers: Map<string, any> = new Map();
  private mediaCodecs: mediasoup.types.RtpCodecCapability[] = [
    {
      kind: 'audio',
      mimeType: 'audio/opus',
      clockRate: 48000,
      channels: 2,
      preferredPayloadType: 111,
    },
    {
      kind: 'video',
      mimeType: 'video/VP8',
      clockRate: 90000,
      preferredPayloadType: 96,
      parameters: {
        'x-google-start-bitrate': 1000,
      },
    },
  ];

  async afterInit(server: Server) {
    this.worker = await mediasoup.createWorker();
    this.router = await this.worker.createRouter({
      mediaCodecs: this.mediaCodecs,
    });
  }

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
    client.to(roomId).emit('viewer-joined', { viewerId: client.id });
    client.to(roomId).emit('previous-messages', previousMessages);
  }

  @SubscribeMessage('left-room')
  leftRoom(@MessageBody() roomId: string, @ConnectedSocket() client: Socket) {
    client.leave(roomId);
  }

  createWorker = async () => {
    this.worker = await mediasoup.createWorker({
      rtcMinPort: 2000,
      rtcMaxPort: 2020,
    });
    this.worker.on('died', (error: any) => {
      // console.log('Mediasoup worker has died');
      setTimeout(() => process.exit(1), 2000);
    });

    return this.worker;
  };

  @SubscribeMessage('getRtpCapabilities')
  getRtpCapabilities(@ConnectedSocket() client: Socket) {
    const rtpCapabilities = this.router.rtpCapabilities;
    return rtpCapabilities;
  }

  @SubscribeMessage('createWebRtcTransport')
  async createWebRTCTransport(
    @MessageBody() { sender }: any,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const transport = await this.router.createWebRtcTransport({
        listenIps: [
          {
            ip: '0.0.0.0',
            announcedIp: '127.0.0.1',
          },
        ],
        enableUdp: true,
        enableTcp: true,
        preferUdp: true,
      });

      transport.on('dtlsstatechange', (state) => {
        if (state === 'closed') transport.close();
      });

      transport.on('close', () => {
        console.log('transport closed');
      });

      if (sender) this.producerTransport = transport;
      else this.consumerTransports.set(client.id, transport);

      return {
        id: transport.id,
        iceParameters: transport.iceParameters,
        iceCandidates: transport.iceCandidates,
        dtlsParameters: transport.dtlsParameters,
      };
    } catch (error: any) {
      return { error: error.message };
    }
  }

  @SubscribeMessage('transport-connect')
  async transportConnect(
    @MessageBody() { dtlsParameters }: { dtlsParameters: any },
  ) {
    await this.producerTransport.connect({ dtlsParameters });
    return {};
  }

  @SubscribeMessage('transport-produce')
  async transportProduce(
    @MessageBody() data: { kind: any; rtpParameters: any; appData: any },
    @ConnectedSocket() client: Socket,
  ) {
    this.producer = await this.producerTransport.produce({
      kind: data.kind,
      rtpParameters: data.rtpParameters,
    });

    this.producer.on('transportclose', () => {
      console.log('transport for this producer closed');
    });

    client.broadcast.emit('producer-ready', { producerId: this.producer.id });

    return { id: this.producer.id };
  }

  @SubscribeMessage('transport-recv-connect')
  async transportRecvConnect(
    @MessageBody() { dtlsParameters }: { dtlsParameters: any },
    @ConnectedSocket() client: Socket,
  ) {
    const consumerTransport = this.consumerTransports.get(client.id);
    await consumerTransport.connect({ dtlsParameters });
    return {};
  }

  @SubscribeMessage('consume')
  async consume(
    @MessageBody() { rtpCapabilities }: any,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      if (
        !this.router.canConsume({
          producerId: this.producer.id,
          rtpCapabilities,
        })
      ) {
        return { error: 'Cannot consume' };
      }

      const consumerTransport = this.consumerTransports.get(client.id);
      const consumer = await consumerTransport.consume({
        producerId: this.producer.id,
        rtpCapabilities,
        paused: true,
      });

      this.consumers.set(client.id, consumer);
      consumer.on('transportclose', () =>
        console.log(`Transport close for ${client.id}`),
      );
      consumer.on('producerclose', () =>
        console.log(`Producer close for ${client.id}`),
      );

      return {
        id: consumer.id,
        producerId: this.producer.id,
        kind: consumer.kind,
        rtpParameters: consumer.rtpParameters,
      };
    } catch (error: any) {
      return { error: error.message };
    }
  }

  @SubscribeMessage('consumer-resume')
  async consumerResume(@ConnectedSocket() client: Socket) {
    const consumer = this.consumers.get(client.id);
    await consumer.resume();
    return {};
  }

  @SubscribeMessage('check-producer')
  checkProducer() {
    return !!this.producer;
  }

  @SubscribeMessage('stream-ended')
  streamEnd(@MessageBody() { roomId }: { roomId: string }) {
    this.server.to(roomId).emit('stream-ended');
  }
}
