export class InputRegisterDto {
  name: string;
  email: string;
  password: string;
}

export class InputLoginDto {
  email: string;
  password: string;
}

export class OutputAuthenticateDto {
    name: string;
    email: string;
}
