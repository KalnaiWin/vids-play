import { Transform } from 'class-transformer';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { TypeInput } from '../video/video.dto';

export class InputUploadBlog {
  @IsString()
  description: string;

  @IsString()
  @IsEnum(['PUBLIC', 'PRIVATE'])
  status: string;

  @IsOptional()
  @Transform(({ value }) => (value ? JSON.parse(value) : undefined))
  @IsArray()
  types?: TypeInput[];
}

export class OutputUploadBlog {
  id: string;
  description: string;
  image_blog: string;
  types?: string[];
}
