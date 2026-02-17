import { createSlice } from "@reduxjs/toolkit";
import type { userInitialState } from "../types/userInterface";
import { subscribeChannel } from "../feature/userThunk";

const initialState: userInitialState = {
  subscription: [],
  status: "idle",
  statusSubscribe: "idle",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(subscribeChannel.pending, (state) => {
        state.statusSubscribe = "loading";
      })
      .addCase(subscribeChannel.fulfilled, (state) => {
        state.statusSubscribe = "succeeded";
      })
      .addCase(subscribeChannel.rejected, (state) => {
        state.statusSubscribe = "failed";
      });
  },
});

export default userSlice.reducer;
