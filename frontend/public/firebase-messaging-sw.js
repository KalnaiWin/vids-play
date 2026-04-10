// public/firebase-messaging-sw.js
importScripts(
  "https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: "AIzaSyDhDSBWICt4JQbiBOPc_RAPEJqH6jZmfhM",
  authDomain: "vidsplay-22f0d.firebaseapp.com",
  projectId: "vidsplay-22f0d",
  storageBucket: "vidsplay-22f0d.firebasestorage.app",
  messagingSenderId: "614023473223",
  appId: "1:614023473223:web:51b863643d467d8f016962",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/icon.png",
  });
});
