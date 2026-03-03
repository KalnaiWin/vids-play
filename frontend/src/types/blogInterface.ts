import type { TypesInput } from "./videoInterface";

export interface BlogsInfo {
  _id: string;
  title: string;
  author: {
    _id: string;
    name: string;
    avatarUrl: string;
  };
  description: string;
  types: TypesInput[];
  image_blog: string;
  status: string;
  likes: string[];
  dislikes: string[];
  createdAt: Date;
}

export interface BlogUpload {
  description: string;
  types: TypesInput[];
  status: string;
}

export interface BlogInitialState {
  blogs: BlogsInfo[];
  blogsDetail: BlogsInfo | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  uploadStatus: "idle" | "loading" | "succeeded" | "failed";
  deleteStatus: "idle" | "loading" | "succeeded" | "failed";
}
