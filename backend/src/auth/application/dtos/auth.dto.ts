import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class InputRegisterDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class InputLoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class OutputAuthenticateDto {
  name: string;
  email: string;
}

export class UserPayload {
  id: string;
  name: string;
}
