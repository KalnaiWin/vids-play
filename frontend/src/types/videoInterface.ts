export interface UploadFiles {
  thumbnailUrl: File | null;
  videoUrl: File | null;
}

export interface VideoInput {
  title: string;
  description: string;
  duration: number;
  visibility: string;
}

export interface VideoInfo {
  title: string;
  description: string;
  owner: {
    name: string;
    avatarUrl: string;
  };
  duration: string;
  thumbnailUrl: string;
  videoUrl: string;
  visibility: string;
  viewCount: number;
  likeCount: string;
  dislikeCount: string;
}

export interface VideoInitailState {
  video: VideoInfo | null;
  statusCreating: "idle" | "loading" | "succeeded" | "failed";
}
