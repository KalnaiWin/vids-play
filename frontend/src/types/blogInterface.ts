import type { TypesInput } from "./videoInterface";

export interface BlogsInfo {
  _id: string;
  title: string;
  author: {
    name: string;
    avatarUrl: string;
  };
  description: string;
  types: TypesInput[];
  image_blog: string;
  status: string;
  likes: [];
  dislikes: [];
  createdAt: Date;
}

export interface BlogUpload {
  description: string;
  types: TypesInput[];
  status: string;
}

export interface BlogInitialState {
  blogs: BlogsInfo[];
  status: "idle" | "loading" | "succeeded" | "failed";
  uploadStatus: "idle" | "loading" | "succeeded" | "failed";
  deleteStatus: "idle" | "loading" | "succeeded" | "failed";
}
