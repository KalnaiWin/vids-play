import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class InputCreateNotification {
  @IsString()
  @IsNotEmpty()
  ownerId: string;

  @IsString()
  @IsNotEmpty()
  refId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsEnum(['VIDEO', 'BLOG'])
  @IsNotEmpty()
  type: string;
}
