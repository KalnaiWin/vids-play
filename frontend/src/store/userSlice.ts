import { createSlice } from "@reduxjs/toolkit";
import type { userInitialState } from "../types/userInterface";
import {
  fetchSubscriptions,
  getChannelUser,
  updateProfileChannel,
} from "../feature/userThunk";

const initialState: userInitialState = {
  subscription: [],
  channel: null,
  status: "idle",
  statusChannel: "idle",
  statusUpdate: "idle",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers(builder) {
    // Update profile channel
    builder
      .addCase(updateProfileChannel.pending, (state) => {
        state.statusUpdate = "loading";
      })
      .addCase(updateProfileChannel.fulfilled, (state) => {
        state.statusUpdate = "succeeded";
      })
      .addCase(updateProfileChannel.rejected, (state) => {
        state.statusUpdate = "failed";
      });

    // Get channel user
    builder
      .addCase(getChannelUser.pending, (state) => {
        state.statusChannel = "loading";
      })
      .addCase(getChannelUser.fulfilled, (state, action) => {
        state.statusChannel = "succeeded";
        state.channel = action.payload;
      })
      .addCase(getChannelUser.rejected, (state) => {
        state.statusChannel = "failed";
      });

    // Get subscriptions
    builder
      .addCase(fetchSubscriptions.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSubscriptions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.subscription = action.payload;
      })
      .addCase(fetchSubscriptions.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default userSlice.reducer;
