import { Transform, Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class VideoInputUpload {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  description: string;

  @IsString()
  duration: string;

  @IsString()
  visibility: string;

  @Transform(({ value }) => JSON.parse(value))
  @IsArray()
  types: TypeInput[];
}

export class TypeInput {
  @IsString()
  name: string;

  @IsArray()
  @IsString()
  slug: string;
}
