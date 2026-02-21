import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Video } from 'src/video/domain/video.schema';
import { TypeInput } from '../dtos/video.dto';
import { Type } from 'src/video/domain/type.schema';
import { Subscription } from 'src/user/application/subscription.schema';
import { UserRepository } from 'src/user/application/port/user.repository';

@Injectable()
export class VideoRepository {
  constructor(
    @InjectModel(Video.name) private videoModel: Model<Video>,
    @InjectModel(Type.name) private typeModel: Model<Type>,
    @InjectModel(Subscription.name)
    private subscriptionModel: Model<Subscription>,
    private userRepository: UserRepository,
  ) {}

  async findAllVideos() {
    return await this.videoModel.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'owner',
          foreignField: '_id',
          as: 'owner',
        },
      },
      {
        $unwind: '$owner',
      },
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          'owner._id': 1,
          'owner.name': 1,
          'owner.avatarUrl': 1,
          duration: 1,
          thumbnailUrl: 1,
          videoUrl: 1,
          visibility: 1,
          viewCount: 1,
          likeCount: 1,
          dislikeCount: 1,
          createdAt: 1,
        },
      },
    ]);
  }

  async getDetailWatchingVideo(videoId: string) {
    return (
      (
        await this.videoModel.aggregate([
          {
            $match: {
              _id: new mongoose.Types.ObjectId(videoId),
            },
          },
          {
            $lookup: {
              from: 'users',
              localField: 'owner',
              foreignField: '_id',
              as: 'owner',
            },
          },
          {
            $unwind: '$owner',
          },
          {
            $lookup: {
              from: 'subscriptions',
              let: { ownerId: '$owner._id' },
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ['$channel', '$$ownerId'] },
                  },
                },
                {
                  $project: {
                    _id: 0,
                    subscriber: 1,
                  },
                },
              ],
              as: 'subscriptions',
            },
          },
          {
            $addFields: {
              subscriptions: {
                $map: {
                  input: '$subscriptions',
                  as: 'sub',
                  in: { $toString: '$$sub.subscriber' },
                },
              },
            },
          },
          {
            $project: {
              _id: 1,
              title: 1,
              description: 1,
              'owner._id': 1,
              'owner.name': 1,
              'owner.avatarUrl': 1,
              'owner.subscriptions': 1,
              thumbnailUrl: 1,
              duration: 1,
              types: 1,
              videoUrl: 1,
              visibility: 1,
              viewCount: 1,
              likes: 1,
              dislikes: 1,
              subscriptions: 1,
              createdAt: 1,
            },
          },
        ])
      )[0] || null
    );
  }

  async getRandomVideos(limit: number, videoId: string) {
    return await this.videoModel.aggregate([
      {
        $match: {
          _id: { $ne: new mongoose.Types.ObjectId(videoId) },
          visibility: 'PUBLIC',
        },
      },
      {
        $sample: { size: limit },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'owner',
          foreignField: '_id',
          as: 'owner',
        },
      },
      {
        $unwind: '$owner',
      },
      {
        $project: {
          _id: 1,
          title: 1,
          thumbnailUrl: 1,
          viewCount: 1,
          duration: 1,
          createdAt: 1,
          'owner._id': 1,
          'owner.name': 1,
          'owner.avatarUrl': 1,
        },
      },
    ]);
  }

  async findOrCreateNewType(types: TypeInput[]) {
    if (!types.length) return [];
    const ids: mongoose.Types.ObjectId[] = [];

    const uniqueTypes = Array.from(
      // remove duplicate slugs
      new Map(types.map((t) => [t.slug, t])).values(),
    );

    const slugs = uniqueTypes.map((t) => t.slug);

    const existingTypes = await this.typeModel.find({
      // find all existing slugs
      slug: { $in: slugs },
    });

    const existingSlugMap = new Map(existingTypes.map((t) => [t.slug, t]));
    for (const type of uniqueTypes) {
      if (existingSlugMap.has(type.slug)) {
        ids.push(existingSlugMap.get(type.slug)!._id);
      } else {
        try {
          const newType = await this.typeModel.create(type);
          ids.push(newType._id);
        } catch (error) {
          const duplicated = await this.typeModel.findOne({
            slug: type.slug,
          });
          if (duplicated) ids.push(duplicated._id);
        }
      }
    }
    return ids;
  }

  async findAllVideosForSpecificUser(userId: string, nameVideo: string) {
    const matchStage: any = {
      owner: new mongoose.Types.ObjectId(userId),
    };

    if (nameVideo && nameVideo.trim() !== '') {
      matchStage.title = {
        $regex: nameVideo,
        $options: 'i',
      };
    }
    return await this.videoModel.aggregate([
      {
        $match: matchStage,
      },
      {
        $project: {
          _id: 1,
          title: 1,
          thumbnailUrl: 1,
          videoUrl: 1,
          duration: 1,
          likes: 1,
          description: 1,
          visibility: 1,
          viewCount: 1,
          createdAt: 1,
        },
      },
    ]);
  }
}
