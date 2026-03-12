import { Module } from '@nestjs/common';
import { LivestreamGateway } from './livestream.gateway';

@Module({
  imports: [],
  providers: [LivestreamGateway],
})
export class SocketModule {}
