import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Subscription {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  subscriber: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  channel: Types.ObjectId;

  @Prop({
    type: String,
    enum: ['all', 'none', 'personal'],
    default: 'all',
  })
  notification: string;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);

SubscriptionSchema.index({ subscriber: 1, channel: 1 }, { unique: true });
