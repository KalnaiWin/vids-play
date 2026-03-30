import { getToken } from "firebase/messaging";
import { db, messaging } from "./firebase";
import { doc, setDoc } from "firebase/firestore";
import axiosInstance from "../axios";

export const requestNotificationPermission = async (uid: any) => {
  console.log("Requesting notification permission... ");
  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    await saveMessagingDeviceToken(uid);
  } else {
    console.log("Unable to get permission to notify");
  }
};

export const saveMessagingDeviceToken = async (uid: any) => {
  const fcmToken = await getToken(messaging, {
    vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
  });
  if (fcmToken) {
    console.log("Got the FCM device token: ", fcmToken);
    localStorage.setItem("current_fcm_token", fcmToken);
    await axiosInstance.put("/user/fcm-token", { fcmToken });
    const tokenRef = doc(db, "fcm_token", uid);
    await setDoc(tokenRef, { fcmToken });
  } else {
    requestNotificationPermission(uid);
  }
};
