import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "./firebase";
import axiosInstance from "../axios";

export const requestNotificationPermission = async (uid: any) => {
  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    await saveMessagingDeviceToken(uid);
  }
};

export const saveMessagingDeviceToken = async (uid: any) => {
  const fcmToken = await getToken(messaging, {
    vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
  });
  if (fcmToken) {
    localStorage.setItem("current_fcm_token", fcmToken);
    await axiosInstance.put("/user/fcm-token", { fcmToken });
  } else {
    requestNotificationPermission(uid);
  }
};

export const listenToForegroundMessages = () => {
  onMessage(messaging, (payload) => {
    navigator.serviceWorker.ready.then((registration) => {
      registration.showNotification(payload.notification?.title ?? "", {
        body: payload.notification?.body,
        icon: "/icon.png",
      });
    });
  });
};
