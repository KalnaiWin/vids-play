import { Injectable } from '@nestjs/common';
import { Blog } from './blog.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class PostRepository {
  constructor(@InjectModel(Blog.name) private blogModel: Model<Blog>) {}

  async getBlogsForOthers(authorId: string) {
    return await this.blogModel.aggregate([
      {
        $match: {
          author: new Types.ObjectId(authorId),
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: '_id',
          as: 'author',
        },
      },
      { $unwind: '$author' },
      {
        $project: {
          _id: 1,
          author: {
            name: '$author.name',
            avatarUrl: '$author.avatarUrl',
          },
          title: 1,
          description: 1,
          types: 1,
          image_blog: 1,
          status: 1,
          likes: 1,
          dislikes: 1,
          createdAt: 1,
        },
      },
    ]);
  }
}
