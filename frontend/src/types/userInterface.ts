export interface Subscription {
  _id: string;
  channelId: string;
  name: string;
  avatarUrl: string;
}

export interface CurrentChannel {
  _id: string;
  name: string;
  handleName: string;
  avatarUrl: string;
  description: string;
  subscribers: string[];
  totalVideoCount: number;
  totalViews: number;
  createdAt: Date;
}

export interface userInitialState {
  subscription: Subscription[];
  channel: CurrentChannel | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  statusChannel: "idle" | "loading" | "succeeded" | "failed";
  statusUpdate: "idle" | "loading" | "succeeded" | "failed";
}
