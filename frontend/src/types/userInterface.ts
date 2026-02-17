export interface Subscription {
  _id: string;
  channelId: string;
  name: string;
  avatarUrl: string;
}

export interface userInitialState {
  subscription: Subscription[];
  status: "idle" | "loading" | "succeeded" | "failed";
  statusSubscribe: "idle" | "loading" | "succeeded" | "failed";
}
