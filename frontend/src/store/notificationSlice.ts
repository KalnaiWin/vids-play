import { createSlice } from "@reduxjs/toolkit";
import type { NotificationState } from "../types/notificationInterface";
import {
  checkHasUnReadNotification,
  checkIsReadNotification,
  deleteNotification,
  getNotificationsOfuser,
} from "../feature/notificationThunk";

const initialState: NotificationState = {
  notifications: [],
  status: "idle",
  delStatus: "idle",
  notRead: false,
};

export const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(deleteNotification.pending, (state) => {
        state.delStatus = "loading";
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.delStatus = "succeeded";
        state.notifications.filter((noti) => noti._id === action.payload);
      })
      .addCase(deleteNotification.rejected, (state) => {
        state.delStatus = "failed";
      });

    builder
      .addCase(getNotificationsOfuser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getNotificationsOfuser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.notifications = action.payload;
      })
      .addCase(getNotificationsOfuser.rejected, (state) => {
        state.status = "failed";
      });

    builder
      .addCase(checkIsReadNotification.pending, (state) => {
        state.status = "loading";
      })
      .addCase(checkIsReadNotification.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.notifications.findIndex(
          (noti) => noti._id === action.payload._id,
        );
        if (index !== -1) {
          state.notifications[index] = action.payload;
        }
      })
      .addCase(checkIsReadNotification.rejected, (state) => {
        state.status = "failed";
      });

    builder
      .addCase(checkHasUnReadNotification.pending, (state) => {
        state.status = "loading";
      })
      .addCase(checkHasUnReadNotification.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.notRead = action.payload;
      })
      .addCase(checkHasUnReadNotification.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default notificationSlice.reducer;
