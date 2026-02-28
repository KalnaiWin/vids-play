import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, maxLength: 20, trim: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ unique: true })
  handleName: string;

  @Prop({ required: true, select: false, minLength: 6 })
  password: string;

  @Prop({ default: '' })
  avatarUrl: string;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'Video' }],
    default: [],
  })
  favouriteVideos: Types.ObjectId[];

  @Prop({ default: 'Chào mừng tới kênh của mình 😊', maxlength: 160 })
  description: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
