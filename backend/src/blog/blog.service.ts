import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Blog } from './blog.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { InputUploadBlog, OutputUploadBlog } from './blog.dto';
import { User } from 'src/user/user.schema';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { VideoRepository } from 'src/video/video.repository';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<Blog>,
    @InjectModel(User.name) private userModel: Model<User>,
    private notificationService: NotificationService,
    private cloudinaryService: CloudinaryService,
    private videoRepository: VideoRepository,
  ) {}

  async uploadBlog(
    authorId: string,
    data: InputUploadBlog,
    imageBlog?: Express.Multer.File,
  ): Promise<OutputUploadBlog> {
    const exsitingUser = await this.userModel.findById(authorId).select('_id');
    if (!exsitingUser) throw new NotFoundException('User not found');

    if (!data.description || data.description === '')
      throw new BadRequestException('Description must be a text');

    let uploadedImage: any = null;

    if (imageBlog) {
      uploadedImage = await this.cloudinaryService.uploadImage(imageBlog);

      if (!uploadedImage) {
        throw new InternalServerErrorException('Upload failed');
      }
    }

    let typeIds: Types.ObjectId[] | undefined;

    if (data.types?.length) {
      typeIds = await this.videoRepository.findOrCreateNewType(data.types);
    }

    const newPost = await this.blogModel.create({
      author: new Types.ObjectId(authorId),
      description: data.description,
      status: data.status !== '' ? data.status : 'PUBLIC',
      image_blog: uploadedImage?.secure_url ?? '',
      types: typeIds ?? [],
    });

    await newPost.save();

    await this.notificationService.createNotification({
      title: newPost.description,
      ownerId: authorId,
      refId: String(newPost._id),
      image: newPost.image_blog,
      type: 'BLOG',
    });

    return {
      id: newPost._id.toString(),
      description: newPost.description,
      image_blog: newPost.image_blog,
      types: newPost.types?.map((id: Types.ObjectId) => id.toString()),
    };
  }

  async deleteBlog(blogId: string, authorId: string) {
    const existingAuthor = await this.userModel
      .findById(authorId)
      .select('_id');
    if (!existingAuthor) throw new NotFoundException('Author not found');
    const deletedBlog = await this.blogModel.findOneAndDelete({
      _id: blogId,
      author: new Types.ObjectId(authorId),
    });
    if (!deletedBlog)
      throw new NotFoundException('Blog not found or not yours');

    return blogId;
  }

  async editBlog(
    blogId: string,
    authorId: string,
    data: InputUploadBlog,
    imageBlog?: Express.Multer.File,
  ): Promise<OutputUploadBlog> {
    const exsitingUser = await this.userModel.findById(authorId).select('_id');
    if (!exsitingUser) throw new NotFoundException('User not found');

    const exsitingBlog = await this.blogModel.findById(blogId).select('_id');
    if (!exsitingBlog) throw new NotFoundException('User not found');

    let uploadedImage: any = null;

    if (imageBlog) {
      uploadedImage = await this.cloudinaryService.uploadImage(imageBlog);

      if (!uploadedImage) {
        throw new InternalServerErrorException('Upload failed');
      }
    }

    let typeIds: Types.ObjectId[] | undefined;

    if (data.types?.length) {
      typeIds = await this.videoRepository.findOrCreateNewType(data.types);
    }

    const updatedPost = await this.blogModel.findOneAndUpdate(
      { _id: blogId, author: new Types.ObjectId(authorId) },
      { $set: data },
      { new: true },
    );

    if (!updatedPost)
      throw new NotFoundException('Blog not found or not yours');

    return {
      id: updatedPost._id.toString(),
      description: updatedPost.description,
      image_blog: updatedPost.image_blog,
      types: updatedPost.types?.map((id: Types.ObjectId) => id.toString()),
    };
  }

  async toggleReactionBlog(
    blogId: string,
    userId: string,
    type: 'like' | 'dislike',
  ) {
    const existignUser = await this.userModel.findById(userId);
    if (!userId) throw new NotFoundException('User not found');

    const exsitingBlog = await this.blogModel.findById(blogId);
    if (!exsitingBlog) throw new NotFoundException('Blog not found');

    const liked = exsitingBlog.likes.some((id) => id.toString() === userId);
    const disliked = exsitingBlog.dislikes.some(
      (id) => id.toString() === userId,
    );

    let updated;

    switch (type) {
      case 'like':
        if (liked) {
          updated = await this.blogModel.findByIdAndUpdate(
            blogId,
            { $pull: { likes: userId } },
            { new: true },
          );
        } else {
          updated = await this.blogModel.findByIdAndUpdate(
            blogId,
            {
              $addToSet: { likes: userId },
              $pull: { dislikes: userId },
            },
            { new: true },
          );
        }
        break;

      case 'dislike':
        if (disliked) {
          updated = await this.blogModel.findByIdAndUpdate(
            blogId,
            { $pull: { dislikes: userId } },
            { new: true },
          );
        } else {
          updated = await this.blogModel.findByIdAndUpdate(
            blogId,
            {
              $addToSet: { dislikes: userId },
              $pull: { likes: userId },
            },
            { new: true },
          );
        }
        break;

      default:
        throw new BadRequestException('Invalid reaction type');
    }

    return {
      likes: updated!.likes,
      dislikes: updated!.dislikes,
    };
  }
}
