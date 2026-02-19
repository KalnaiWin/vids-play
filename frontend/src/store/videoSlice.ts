import { createSlice } from "@reduxjs/toolkit";
import type { VideoInitailState } from "../types/videoInterface";
import {
  getAllVideosForSpecificUser,
  getAllVieos,
  recommendVideos,
  toggleReactionVideo,
  uploadVideo,
  watchVieo,
} from "../feature/videoThunk";
import { subscribeChannel } from "../feature/userThunk";

const initialState: VideoInitailState = {
  videos: [],
  watchingVideo: null,
  recommendedVideos: [],
  videosOfUser: [],
  statusCreating: "idle",
  status: "idle",
  statusReaction: "idle",
  statusFetchingVideos: "idle",
  statusSubscribe: "idle",
};

export const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(subscribeChannel.pending, (state) => {
        state.statusSubscribe = "loading";
      })
      .addCase(subscribeChannel.fulfilled, (state, action) => {
        if (!state.watchingVideo) return;
        state.statusSubscribe = "succeeded";
        const userId = action.payload.userId;
        const index = state.watchingVideo.subscriptions.indexOf(userId);
        if (index > -1) {
          state.watchingVideo.subscriptions.splice(index, 1);
        } else {
          state.watchingVideo.subscriptions.push(userId);
        }
      })
      .addCase(subscribeChannel.rejected, (state) => {
        state.statusSubscribe = "failed";
      });

    // Get all videos of user
    builder
      .addCase(getAllVideosForSpecificUser.pending, (state) => {
        state.statusFetchingVideos = "loading";
      })
      .addCase(getAllVideosForSpecificUser.fulfilled, (state, action) => {
        state.statusFetchingVideos = "succeeded";
        state.videosOfUser = action.payload;
      })
      .addCase(getAllVideosForSpecificUser.rejected, (state) => {
        state.statusFetchingVideos = "failed";
      });

    // Toggle reaction videos
    builder
      .addCase(toggleReactionVideo.pending, (state) => {
        state.statusReaction = "loading";
      })
      .addCase(toggleReactionVideo.fulfilled, (state, action) => {
        state.statusReaction = "succeeded";
        if (state.watchingVideo) {
          state.watchingVideo.likes = action.payload.likes;
          state.watchingVideo.dislikes = action.payload.dislikes;
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
        state.status = "succeeded";
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
