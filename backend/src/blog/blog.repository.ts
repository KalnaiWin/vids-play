import { Injectable } from '@nestjs/common';
import { Blog } from './blog.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class BlogRepository {
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
            _id: '$author._id',
            name: '$author.name',
            avatarUrl: '$author.avatarUrl',
          },
          description: 1,
          types: 1,
          image_blog: 1,
          status: 1,
          likes: 1,
          dislikes: 1,
          createdAt: 1,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);
  }

  async getBlogDetail(blogId: string) {
    return await this.blogModel.aggregate([
      {
        $match: {
          _id: new Types.ObjectId(blogId),
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
            _id: '$author._id',
            name: '$author.name',
            avatarUrl: '$author.avatarUrl',
          },
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
