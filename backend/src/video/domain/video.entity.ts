import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Video {
  @Prop({ required: true, maxLength: 200, trim: true })
  title: string;

  @Prop({ default: 'Video có bản quyền', maxlength: 5000, trim: true })
  description: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    index: true,
    required: true,
  })
  owner: Types.ObjectId;

  @Prop({ required: true })
  thumbnailUrl: string;

  @Prop({ required: true })
  videoUrl: string;

  @Prop({ required: true })
  duration: number;

  @Prop({
    enum: ['PUBLIC', 'UNLISTED', 'PRIVATE'],
    default: 'PUBLIC',
    index: true,
  })
  visibility: 'PUBLIC' | 'UNLISTED' | 'PRIVATE';

  @Prop({ default: 0 })
  viewCount: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  likeCount: number;

  @Prop({ default: 0 })
  dislikeCount: number;

  @Prop({
    type: [
      {
        user: { type: Types.ObjectId, ref: 'User' },
        reason: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    default: [],
  })
  reports: {
    user: Types.ObjectId;
    reason: string;
    createdAt: Date;
  }[];
}

export const VideoSchema = SchemaFactory.createForClass(Video);
