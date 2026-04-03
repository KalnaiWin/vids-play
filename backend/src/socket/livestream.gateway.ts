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

// @WebSocketGateway(8001, { cors: '*' })
@WebSocketGateway({ cors: { origin: process.env.CLIENT_URL } })
export class LivestreamGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  private logger: Logger = new Logger('CommentGateWay');
  private roomMessages: Map<string, ChatInput[]> = new Map();
  private cameraEnabled: any;
  private worker: any;
  private router: any;
  private producerTransport: any;
  private producers: Map<string, any> = new Map();
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
    const producer = await this.producerTransport.produce({
      kind: data.kind,
      rtpParameters: data.rtpParameters,
      appData: data.appData,
    });

    this.producers.set(producer.id, producer);

    producer.on('transportclose', () => {
      this.producers.delete(producer.id);
    });

    client.broadcast.emit('producer-ready', { producerId: producer.id });
    return { id: producer.id };
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

  @SubscribeMessage('consume-all')
  async consumeAll(
    @MessageBody() { rtpCapabilities }: any,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const consumers: any[] = [];
      const consumerTransport = this.consumerTransports.get(client.id);

      for (const [, producer] of this.producers) {
        // ← iterate producers map
        if (
          !this.router.canConsume({ producerId: producer.id, rtpCapabilities })
        )
          continue;

        const consumer = await consumerTransport.consume({
          producerId: producer.id,
          rtpCapabilities,
          paused: true,
        });

        this.consumers.set(`${client.id}-${producer.id}`, consumer); // ← key by both

        consumers.push({
          id: consumer.id,
          producerId: producer.id,
          kind: consumer.kind,
          rtpParameters: consumer.rtpParameters,
          appData: producer.appData, // ← send type tag to client
        });
      }

      return consumers;
    } catch (error: any) {
      return { error: error.message };
    }
  }

  @SubscribeMessage('consumer-resume')
  async consumerResume(
    @MessageBody() { consumerId }: { consumerId: string },
    @ConnectedSocket() client: Socket,
  ) {
    for (const [key, consumer] of this.consumers) {
      if (key.startsWith(client.id) && consumer.id === consumerId) {
        await consumer.resume();
        return {};
      }
    }
    return { error: 'Consumer not found' };
  }

  @SubscribeMessage('check-producer')
  checkProducer() {
    return this.producers.size > 0;
  }

  @SubscribeMessage('stream-ended')
  streamEnd(@MessageBody() { roomId }: { roomId: string }) {
    this.server.to(roomId).emit('stream-ended');
  }

  @SubscribeMessage('start-stream')
  startStream(@MessageBody() { roomId }: { roomId: string }) {
    this.server.to(roomId).emit('start-stream');
  }

  @SubscribeMessage('get-camera-state')
  getCameraState() {
    return { enabled: this.cameraEnabled };
  }

  @SubscribeMessage('camera-toggle')
  cameraToggle(
    @MessageBody() { roomId, enabled }: { roomId: string; enabled: boolean },
    @ConnectedSocket() client: Socket,
  ) {
    this.cameraEnabled = enabled; // ← save state
    client.to(roomId).emit('camera-toggle', { enabled });
  }
}
