import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

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

  @IsOptional()
  @Transform(({ value }) => (value ? JSON.parse(value) : undefined))
  @IsArray()
  types?: TypeInput[];

  @IsString()
  scheduleDate: string;

  @IsString()
  scheduleTime: string;
}

export class TypeInput {
  @IsString()
  name: string;

  @IsArray()
  @IsString()
  slug: string;
}
