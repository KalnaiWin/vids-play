import { createSlice } from "@reduxjs/toolkit";
import type { VideoInitailState } from "../types/videoInterface";
import { uploadVideo } from "../feature/videoThunk";

const initialState: VideoInitailState = {
  video: null,
  statusCreating: "idle",
};

export const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(uploadVideo.pending, (state) => {
        state.statusCreating = "loading";
      })
      .addCase(uploadVideo.fulfilled, (state, action) => {
        state.statusCreating = "succeeded";
        state.video = action.payload;
      })
      .addCase(uploadVideo.rejected, (state) => {
        state.statusCreating = "failed";
      });
  },
});

export default videoSlice.reducer;
