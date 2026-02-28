import { Injectable, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

export const CLOUDINARY = 'CLOUDINARY';

export const CloudinaryProvider: Provider = {
  provide: CLOUDINARY,
  useFactory: (configService: ConfigService) => {
    return cloudinary.config({
      cloud_name: configService.get<string>('CLOUD_NAME'),
      api_key: configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  },
  inject: [ConfigService],
};

@Injectable()
export class CloudinaryService {
  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: 'thumbnails',
            resource_type: 'image',
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result as UploadApiResponse);
          },
        )
        .end(file.buffer);
    });
  }

  async uploadVideo(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: 'videos',
            resource_type: 'video',
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result as UploadApiResponse);
          },
        )
        .end(file.buffer);
    });
  }
}
