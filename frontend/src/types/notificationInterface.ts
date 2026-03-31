export interface NotificationInfo {
  _id: string;
  ownerName: string;
  avatar: string;
  image?: string;
  title: string;
  isRead: boolean;
  refId: string;
  type: string;
  createdAt: Date;
}

export interface NotificationState {
  notifications: NotificationInfo[];
  status: "idle" | "loading" | "succeeded" | "failed";
}
