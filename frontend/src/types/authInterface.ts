export interface UserInfo {
  name: string;
  email: string;
  avatarUrl: string;
}

export interface authInitialState {
  user: UserInfo | null;
  status: "idle" | "loading" | "succeeded" | "failed";
}

export interface registerInput {
  name: string;
  email: string;
  password: string;
}

export interface loginInputAndGlobalOutput {
  email: string;
  password: string;
}
