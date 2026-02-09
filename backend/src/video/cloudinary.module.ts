import { Module } from '@nestjs/common';
import {
  CloudinaryProvider,
  CloudinaryService,
} from './application/cloudinary.service';
import { ConfigModule } from '@nestjs/config';
import config from 'src/config/config';

@Module({
  imports: [
    ConfigModule,
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: '.env',
      load: [config],
    }),
  ],
  providers: [CloudinaryService, CloudinaryProvider],
  exports: [CloudinaryService, CloudinaryProvider],
})
export class CloudinaryModule {}
