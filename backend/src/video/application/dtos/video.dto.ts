import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class VideoInputUpload {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  description: string;

  @Type(() => Number)
  @IsNumber()
  duration: number;
}
