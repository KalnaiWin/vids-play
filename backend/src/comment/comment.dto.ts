import { IsIn, IsString } from 'class-validator';

export class InputPostComment {
  @IsString()
  content: string;

  @IsString()
  @IsIn(['Video', 'Blog'])
  onModel: 'Video' | 'Blog';
}

export class ChatInput {
  @IsString()
  roomId: string;

  @IsString()
  _id: string;

  @IsString()
  handleName: string;

  @IsString()
  avatarUrl: string;

  @IsString()
  comment: string;
}
