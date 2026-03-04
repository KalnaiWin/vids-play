import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from 'src/user/user.schema';
import { Comment } from './comment.schema';
import { InputPostComment } from './comment.dto';
import { Video } from 'src/video/video.schema';
import { Blog } from 'src/blog/blog.schema';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    @InjectModel(Video.name) private videoModel: Model<Video>,
    @InjectModel(Blog.name) private blogModel: Model<Blog>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async postCommentVideo(
    userId: string,
    content: string,
    videoId: string,
    imageCmt?: Express.Multer.File,
  ) {
    {
      const exisitingUser = await this.userModel.findById(userId);
      if (!exisitingUser) throw new NotFoundException('User not found');

      const exisitingBlog = await this.videoModel.findById(videoId);
      if (!exisitingBlog) throw new NotFoundException('Video not found');

      const uploadImage = imageCmt
        ? await this.cloudinaryService.uploadImage(imageCmt)
        : null;

      if (content === '')
        throw new BadRequestException('Content should not be empty');

      const postedComment = await this.commentModel.create({
        author: new Types.ObjectId(userId),
        content: content,
        target: new Types.ObjectId(exisitingBlog._id),
        onModel: 'Video',
        imageCmt: uploadImage ? uploadImage.secure_url : '',
      });

      await postedComment.save();

      return postedComment;
    }
  }

  async postCommentBlog(
    userId: string,
    content: string,
    blogId: string,
    imageCmt?: Express.Multer.File,
  ) {
    const exisitingUser = await this.userModel.findById(userId);
    if (!exisitingUser) throw new NotFoundException('User not found');

    const exisitingBlog = await this.blogModel.findById(blogId);
    if (!exisitingBlog) throw new NotFoundException('Blog not found');

    const uploadImage = imageCmt
      ? await this.cloudinaryService.uploadImage(imageCmt)
      : null;

    if (content === '')
      throw new BadRequestException('Content should not be empty');

    const postedComment = await this.commentModel.create({
      author: new Types.ObjectId(userId),
      content: content,
      target: new Types.ObjectId(exisitingBlog._id),
      onModel: 'Blog',
      imageCmt: uploadImage ? uploadImage.secure_url : '',
    });

    await postedComment.save();

    return postedComment;
  }

  async deleteComment(userId: string, commentId: string) {
    const existingUser = await this.userModel.findById(userId);
    if (!existingUser) throw new NotFoundException('User not found');

    const exisitingComment = await this.commentModel.findById(commentId);
    if (!exisitingComment) throw new NotFoundException('Comment not found');

    if (String(exisitingComment.author._id) !== String(existingUser._id))
      throw new ForbiddenException('Only author can delete this comment');

    await this.commentModel.findByIdAndDelete(commentId);

    return commentId;
  }
}
