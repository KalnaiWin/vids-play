import { configureStore } from "@reduxjs/toolkit";
import globalSlice from "./globalSlice";
import authSlice from "./authSlice";
import videoSlice from "./videoSlice";
import userSlice from "./userSlice";

export const store = configureStore({
  reducer: {
    global: globalSlice,
    auth: authSlice,
    video: videoSlice,
    user: userSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
