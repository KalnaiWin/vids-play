import type { BlogsInfo } from "./blogInterface";
export interface UploadFiles {
  thumbnailUrl: File | null;
  videoUrl: File | null;
}

export interface TypesInput {
  name: string;
  slug: string;
}

export interface VideoInput {
  title: string;
  description: string;
  duration: number;
  visibility: string;
  types: TypesInput[];
  scheduleDate: string;
  scheduleTime: string;
}

export interface VideoInfo {
  _id: string;
  title: string;
  description: string;
  owner: {
    _id: string;
    name: string;
    avatarUrl: string;
  };
  duration: string;
  thumbnailUrl: string;
  videoUrl: string;
  visibility: string;
  viewCount: number;
  likes: [];
  dislikes: [];
  createdAt: Date;
}

export interface VideoWatchingInfo {
  _id: string;
  title: string;
  description: string;
  owner: {
    _id: string;
    name: string;
    avatarUrl: string;
    subscriptions: string;
  };
  thumbnailUrl: string;
  types: TypesInput[];
  videoUrl: string;
  duration: number;
  visibility: string;
  viewCount: number;
  likes: string[];
  dislikes: string[];
  subscriptions: string[];
  createdAt: Date;
  scheduledAt: Date;
}

export interface RecommendVideos {
  _id: string;
  title: string;
  thumbnailUrl: string;
  viewCount: number;
  duration: string;
  createdAt: Date;
  owner: {
    _id: string;
    name: string;
    avatarUrl: string;
  };
}
export interface WatchedVideos {
  _id: string;
  video: {
    _id: string;
    thumbnailUrl: string;
    title: string;
    viewCount: string;
  };
  duration: number;
  progress: number;
  updatedAt: Date;
  user: {
    _id: string;
    name: string;
    avatarUrl: string;
  };
}

export interface ReactionResponse {
  likes: [];
  dislikes: [];
}

export interface VideosForSpecificUser {
  _id: string;
  title: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: string;
  likes: [];
  description: string;
  visibility: string;
  viewCount: number;
  commentCount: number;
  createdAt: Date;
}

export interface HomePageVideo {
  popularVideos: VideoInfo[];
  latestVideos: VideoInfo[];
  blogs: BlogsInfo[];
}

export interface VideoInitailState {
  videos: VideoInfo[];
  subscriptionVideos: VideoInfo[];
  nextPage: number;
  hasMore: boolean;
  homeVideos: HomePageVideo | null;
  likedVideo: RecommendVideos[];
  watchingVideo: VideoWatchingInfo | null;
  recommendedVideos: RecommendVideos[];
  videosOfUser: VideosForSpecificUser[];
  watchedVideo: WatchedVideos[];
  status: "idle" | "loading" | "succeeded" | "failed";
  statusCreating: "idle" | "loading" | "succeeded" | "failed";
  statusReaction: "idle" | "loading" | "succeeded" | "failed";
  statusFetchingVideos: "idle" | "loading" | "succeeded" | "failed";
  statusSubscribe: "idle" | "loading" | "succeeded" | "failed";
  statusDelete: "idle" | "loading" | "succeeded" | "failed";
  statusUpdate: "idle" | "loading" | "succeeded" | "failed";
}
