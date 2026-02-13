import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Type {
  @Prop({ maxLength: 30 })
  name: string;

  @Prop({ required: true, unique: true })
  slug: string;
}

export const TypeSchema = SchemaFactory.createForClass(Type);
