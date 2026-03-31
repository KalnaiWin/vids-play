import { createSlice } from "@reduxjs/toolkit";
import type { NotificationState } from "../types/notificationInterface";
import { getNotificationsOfuser } from "../feature/notificationThunk";

const initialState: NotificationState = {
  notifications: [],
  status: "idle",
};

export const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {},
  extraReducers(builder) {
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
  },
});

export default notificationSlice.reducer;
