import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Blog } from './blog.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Types } from 'mongoose';
import { PostRepository } from './blog.repository';
import { InputUploadBlog, OutputUploadBlog } from './blog.dto';
import { User } from 'src/user/user.schema';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { VideoRepository } from 'src/video/video.repository';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<Blog>,
    @InjectModel(User.name) private userModel: Model<User>,
    private postRepository: PostRepository,
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
      title: data.title,
      description: data.description,
      status: data.status !== '' ? data.status : 'PUBLIC',
      image_blog: uploadedImage?.secure_url ?? '',
      types: typeIds ?? [],
    });

    await newPost.save();
    return {
      id: newPost._id.toString(),
      title: newPost.title,
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

    return { message: 'Blog deleted successfully' };
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
      title: updatedPost.title,
      description: updatedPost.description,
      image_blog: updatedPost.image_blog,
      types: updatedPost.types?.map((id: Types.ObjectId) => id.toString()),
    };
  }
}
