import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Blog {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    index: true,
    required: true,
  })
  author: Types.ObjectId;

  @Prop({ required: true, type: String })
  description: string;

  @Prop({
    type: [
      {
        type: Types.ObjectId,
        ref: 'Type',
        index: true,
      },
    ],
    default: [],
  })
  types: Types.ObjectId[];

  @Prop({ type: String })
  image_blog: string;
  @Prop({
    enum: ['PUBLIC', 'PRIVATE'],
    default: 'PUBLIC',
    index: true,
  })
  status: 'PUBLIC' | 'PRIVATE';

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  likes: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  dislikes: Types.ObjectId[];
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
