# Firebase message pushing queue

## Client

`const app = initializeApp(firebaseConfig);`: Initialize app instance depending on firebaseConfig ( apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId, measurementId )

```ts
export const messaging = getMessaging(app);
export const storage = getStorage(app);
```

- `messaging` is used for push notifications (FCM)
- `storage` is used for file uploads/downloads

`requestNotificationPermission`: Permission + Token

```ts
export const requestNotificationPermission = async (uid: any) => {
  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    await saveMessagingDeviceToken(uid);
  }
};
```

--> Triggers the browser's native permission popup ("Allow notifications?"). If the user clicks Allow, it proceeds to get and save the FCM token. If denied, nothing happens — you cannot re-prompt the user after they deny, the browser blocks it permanently until they manually reset it in settings.

`saveMessagingDeviceToken`: Save message to localStorage + save in db

```ts
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
```

`listenToForegroundMessages`:

```ts
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
```

- By default, Firebase only shows push notifications when the app is in the background (handled automatically by the service worker). When the app is in the foreground (tab is open and active), Firebase suppresses the notification and delivers the payload to `onMessage` instead — it's up to you to display it.

- This function bridges that gap. It listens for incoming messages while the app is open, then manually triggers a native browser notification via the Service Worker API (
  `registration.showNotification()`), making foreground and background notifications behave consistently for the user.


file: `firebase-messaging-sw.js`: This is a Service Worker file — it runs in a separate background thread in the browser, completely independent from your React app. The browser keeps it alive even when the tab is closed or the app is not open.

Why initialize again here ?
--> The Service Worker runs in a completely isolated context — it has no access to your React app's memory, variables, or the messaging instance you created in firebase.ts. So Firebase must be initialized from scratch here with hardcoded config (environment variables like import.meta.env are also unavailable in Service Workers).

``` ts
App tab is open --> onMessage() in messaging.ts
App tab is closed / backgrounded --> onBackgroundMessage() here in the Service Worker
```


## Server

1. Create notifications ( must have senderId, receiverId ) when subscribed channel posted a video, created a live stream room, posted a blog.

2. Get `ALL` the fcmTokens stored from each receiver and pass to the sendFcmToken(token, payload)

3. `sendFcmToken` function

3.1. `chunkArray` function
Why need this ?
--> FCM's multicast API has a `hard limit of 500 tokens per request`. If you have 1200 subscribers, sending all at once would fail. chunkArray splits the flat token array into batches of 500:
```ts
[token-1, token-2, ... token-1200]
→ [
    [token-1 ... token-500],    // chunk 0
    [token-501 ... token-1000], // chunk 1
    [token-1001 ... token-1200] // chunk 2
  ]
```
How it work ? --> 

In may case
`Math.ceil(1200 / 500) = 3`
--> creates an array of 3 slots, then fills each slot by slicing the original array at the correct offset. Clean one-liner alternative to a for loop.
```ts
Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
  arr.slice(i * size, i * size + size),
)
```

- Sending All Chunks in Parallel

- `chunks.map()` fires all FCM requests simultaneously rather than waiting for each chunk to finish before starting the next.
- `Promise.allSettled` waits for all of them to complete regardless of whether any individual chunk fails — unlike `Promise.all` which would abort everything if one chunk throws.


- `sendEachForMulticast(token, notification, data)`:
    token: All tokens
    + notification: Rendered by OS/browser automatically (title, body, image in the system tray)
    + data: Silent key-value pairs your app can read when the notification is tapped (for deep-linking via refId)


-  Collect stale/invalid tokens: 
``` ts
results.forEach((result, chunkIdx) => {
  if (result.status === 'fulfilled') {
    result.value.responses.forEach((resp, tokenIdx) => {
      if (!resp.success) {
        const code = resp.error?.code;
        if (
          code === 'messaging/invalid-registration-token' ||
          code === 'messaging/registration-token-not-registered'
        ) {
          staleTokens.push(chunks[chunkIdx][tokenIdx]);
        }
      }
    });
  }
});
```

- `sendEachForMulticast` returns one response per token inside `result.value.responses` — even if some tokens failed and others succeeded within the same chunk. The index of each response maps 1-to-1 with the token at the same index in the chunk, which is why `chunks[chunkIdx][tokenIdx]` correctly identifies exactly which token failed.

Err code:
`invalid-registration-token`: Token is malformed or was never valid
`registration-token-not-registered`: Token was valid but the user uninstalled the app or revoked notification permission


- Removing Stale Tokens from Database
```ts
if (staleTokens.length) {
  await this.userModel.updateMany(
    { fcmTokens: { $in: staleTokens } },
    { $pull: { fcmTokens: { $in: staleTokens } } },
  );
}
```

--> A single MongoDB `updateMany` finds every user document that contains any of the stale tokens and removes them using `$pull`. This keeps the token list clean so future notification sends don't waste FCM quota hitting dead tokens. Without this cleanup, your token list would grow indefinitely with useless entries every time users uninstall the app.

## Flow Summary
```ts
tokens [1200 tokens]
    │
    ▼
chunkArray(500)
    │
    ├── chunk[0] → sendEachForMulticast ─┐
    ├── chunk[1] → sendEachForMulticast ─┤ Promise.allSettled (parallel)
    └── chunk[2] → sendEachForMulticast ─┘
                          │
                          ▼
               per-token response analysis
                          │
              ┌───────────┴───────────┐
           success                 failure
              │                       │
           counted              check error code
                                       │
                              invalid/unregistered?
                                       │
                                 staleTokens[]
                                       │
                                       ▼
                              updateMany $pull
                         (remove from all user docs)
```

