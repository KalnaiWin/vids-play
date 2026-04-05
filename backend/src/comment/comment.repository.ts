import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Blog } from '../blog/blog.schema';
import { User } from '../user/user.schema';
import { Video } from '../video/video.schema';
import { Comment } from './comment.schema';

@Injectable()
export class CommentRepository {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    @InjectModel(Video.name) private videoModel: Model<Video>,
    @InjectModel(Blog.name) private blogModel: Model<Blog>,
  ) {}

  async getComments(id: string) {
    return await this.commentModel.aggregate([
      {
        $match: {
          target: new Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $project: {
          _id: 1,
          user: {
            _id: '$user._id',
            handleName: '$user.handleName',
            avatarUrl: '$user.avatarUrl',
          },
          content: 1,
          videoCmt: 1,
          imageCmt: 1,
          likes: 1,
          createdAt: 1,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);
  }
}
