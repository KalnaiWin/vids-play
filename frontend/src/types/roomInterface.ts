export interface RoomStreamingInfo {
  _id: string;
  title: string;
  totalViews: number;
  host: {
    _id: string;
    name: string;
    avatarUrl: string;
  };
  thumbnail: string;
  startedAt: Date;
  status: string;
  endedAt: Date;
  description: string;
  subscriptions: string[];
  likes: string[];
  dislikes: string[];
}

export interface RoomInfo {
  _id: string;
  title: string;
  host: {
    _id: string;
    name: string;
    avatarUrl: string;
  };
  thumbnail: string;
  description: string;
  totalViews: number;
  startedAt: Date;
  endedAt: Date;
  status: string;
  likes: string[];
  commentCount: number;
}

export interface RoomInitialState {
  streamingRoom: RoomStreamingInfo | null;
  rooms: RoomInfo[];
  myRooms: RoomInfo[];
  status: "idle" | "loading" | "succeeded" | "failed";
  createStatus: "idle" | "loading" | "succeeded" | "failed";
  statusReaction: "idle" | "loading" | "succeeded" | "failed";
  statusDelete: "idle" | "loading" | "succeeded" | "failed";
  statusUpdate: "idle" | "loading" | "succeeded" | "failed";
}
