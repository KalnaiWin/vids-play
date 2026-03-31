import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Notification {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  sender: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  receiver: Types.ObjectId;

  @Prop({ type: String })
  refId: string;

  @Prop({ type: String, default: '' })
  image: string;

  @Prop({
    enum: ['VIDEO', 'BLOG'],
    default: 'BLOG',
  })
  type: 'BLOG';

  @Prop({ type: String, required: true, default: '' })
  title: string;

  @Prop({ type: Boolean, default: false })
  isRead: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
