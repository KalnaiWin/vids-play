import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Video } from '../domain/video.schema';
import { Model } from 'mongoose';
import { VideoInputUpload } from './dtos/video.dto';
import { User } from 'src/user/domain/user.schema';
import { CloudinaryService } from './cloudinary.service';

@Injectable()
export class VideoService {
  constructor(
    @InjectModel(Video.name) private videoModel: Model<Video>,
    @InjectModel(User.name) private userModel: Model<User>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async postNewVideo(
    userId: string,
    data: VideoInputUpload,
    thumbnail: Express.Multer.File,
    video: Express.Multer.File,
  ) {
    const existingUser = await this.userModel.findById(userId);
    if (!existingUser) throw new NotFoundException('User not found');

    if (!thumbnail || !video) {
      throw new BadRequestException('Thumbnail and video are required');
    }

    // console.log('Buffer thumbnail', thumbnail.buffer);
    // console.log('Buffer video', video.buffer);

    const uploadedImage = await this.cloudinaryService.uploadImage(thumbnail);
    const uploadedVideo = await this.cloudinaryService.uploadVideo(video);

    if (!uploadedVideo || !uploadedImage)
      throw new InternalServerErrorException('Upload failed');

    // console.log(uploadedImage);
    // console.log(uploadedVideo);

    const newUploadedVideo = await this.videoModel.create({
      owner: existingUser._id,
      title: data.title,
      description: data.description,
      duration: data.duration,
      videoUrl: uploadedVideo.secure_url,
      thumbnailUrl: uploadedImage.secure_url,
    });

    console.log(newUploadedVideo);

    return { message: 'Upload video successfully' };
  }
}
