import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class History {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Video', required: true })
  video: Types.ObjectId;

  @Prop({ type: Date, default: Date.now })
  watchedAt: Date;

  @Prop({ default: 0 })
  progress: Number;

  @Prop({ default: 0 })
  duration: Number;
}

export const HistorySchema = SchemaFactory.createForClass(History);

HistorySchema.index({ user: 1, updatedAt: -1 });
HistorySchema.index({ user: 1, video: 1 });