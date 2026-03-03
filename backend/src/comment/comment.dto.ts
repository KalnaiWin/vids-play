import { IsIn, IsString } from 'class-validator';

export class InputPostComment {
  @IsString()
  content: string;

  @IsString()
  @IsIn(['Video', 'Blog'])
  onModel: 'Video' | 'Blog';
}
