import { IsDate, IsString, IsOptional } from 'class-validator';

export class InputCreateNotification {
  @IsString()
  title: string;

  @IsString()
  ownerId: string;

  @IsString()
  refId: string;

  @IsOptional()
  @IsString()
  image?: string;
}
