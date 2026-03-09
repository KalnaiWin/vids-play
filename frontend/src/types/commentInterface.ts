export interface CommentInfo {
  _id: string;
  user: {
    _id: string;
    handleName: string;
    avatarUrl: string;
  };
  content: string;
  videoCmt: string;
  imageCmt: string;
  likes: string[];
  createdAt: Date;
}

export interface CommentInitialState {
  comments: CommentInfo[];
  status: "idle" | "loading" | "succeeded" | "failed";
  postStatus: "idle" | "loading" | "succeeded" | "failed";
  deleteStatus: "idle" | "loading" | "succeeded" | "failed";
}

export interface Message {
  roomId: string;
  _id: string;
  handleName: string;
  avatarUrl: string;
  comment: string;
  createdAt: Date;
}
