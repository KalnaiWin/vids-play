import { createSlice } from "@reduxjs/toolkit";
import type { VideoInitailState } from "../types/videoInterface";
import {
  getAllVieos,
  recommendVideos,
  toggleReactionVideo,
  uploadVideo,
  watchVieo,
} from "../feature/videoThunk";

const initialState: VideoInitailState = {
  videos: [],
  watchingVideo: null,
  recommendedVideos: [],
  statusCreating: "idle",
  status: "idle",
  statusReaction: "idle",
};

export const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {},
  extraReducers(builder) {
    // Get recommended videos
    builder
      .addCase(toggleReactionVideo.pending, (state) => {
        state.statusReaction = "loading";
      })
      .addCase(toggleReactionVideo.fulfilled, (state, action) => {
        state.statusReaction = "succeeded";
        if (state.watchingVideo) {
          state.watchingVideo.likeCount = action.payload.likeCount;
          state.watchingVideo.dislikeCount = action.payload.dislikeCount;
          state.watchingVideo.isLiked = action.payload.isLiked;
          state.watchingVideo.isDisliked = action.payload.isDisliked;
        }
      })
      .addCase(toggleReactionVideo.rejected, (state) => {
        state.statusReaction = "failed";
      });

    // Get recommended videos
    builder
      .addCase(recommendVideos.pending, (state) => {
        state.status = "loading";
      })
      .addCase(recommendVideos.fulfilled, (state, action) => {
        ((state.status = "succeeded"), state);
        state.recommendedVideos = action.payload;
      })
      .addCase(recommendVideos.rejected, (state) => {
        state.status = "failed";
      });

    // Watch video
    builder
      .addCase(watchVieo.pending, (state) => {
        state.status = "loading";
      })
      .addCase(watchVieo.fulfilled, (state, action) => {
        ((state.status = "succeeded"), state);
        state.watchingVideo = action.payload;
      })
      .addCase(watchVieo.rejected, (state) => {
        state.status = "failed";
      });

    // Fetch all videos
    builder
      .addCase(getAllVieos.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllVieos.fulfilled, (state, action) => {
        ((state.status = "succeeded"), (state.videos = action.payload));
      })
      .addCase(getAllVieos.rejected, (state) => {
        state.status = "failed";
      });

    // Upload video
    builder
      .addCase(uploadVideo.pending, (state) => {
        state.statusCreating = "loading";
      })
      .addCase(uploadVideo.fulfilled, (state, action) => {
        state.statusCreating = "succeeded";
        state.videos.push(action.payload);
      })
      .addCase(uploadVideo.rejected, (state) => {
        state.statusCreating = "failed";
      });
  },
});

export default videoSlice.reducer;
