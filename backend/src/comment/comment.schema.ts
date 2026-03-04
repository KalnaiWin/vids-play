import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Comment {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  author: Types.ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop({
    type: Types.ObjectId,
    required: true,
    refPath: 'onModel',
  })
  target: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    enum: ['Video', 'Blog'],
  })
  onModel: string;

  @Prop({ type: String })
  imageCmt: string;

  @Prop({ type: Types.ObjectId, ref: 'Comment', default: null })
  parent: Types.ObjectId | null;

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  likes: Types.ObjectId[];
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
