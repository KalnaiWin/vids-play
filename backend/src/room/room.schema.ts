import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Room {
  @Prop({ required: true, type: String })
  title: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  host: Types.ObjectId;

  @Prop({ type: String, default: '' })
  description: string;

  @Prop({ type: String })
  thumbnail: string;

  @Prop({ default: null })
  startedAt: Date;

  @Prop({ default: null })
  endedAt: Date;

  @Prop({ default: 0 })
  totalViews: number;

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  likes: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  dislikes: Types.ObjectId[];

  @Prop({
    enum: ['LIVE', 'STOP', 'WAITING'],
    default: 'LIVE',
    index: true,
  })
  status: 'LIVE' | 'STOP' | 'WAITING';

  @Prop({ type: Date, default: null })
  scheduledAt: Date | null;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
