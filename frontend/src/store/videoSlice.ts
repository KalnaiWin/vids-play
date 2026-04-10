import { createSlice } from "@reduxjs/toolkit";
import type { VideoInitailState } from "../types/videoInterface";
import {
  deleteVideo,
  deleteWatchedVideo,
  editVideo,
  getAllVideos,
  getAllVideosForSpecificUser,
  getHistoryWatchedVideos,
  getHomepageVideos,
  getLikedVideo,
  getSearchVideos,
  getSubscriptionVideos,
  insertWatchedVideo,
  recommendVideos,
  toggleReactionVideo,
  uploadVideo,
  watchVieo,
} from "../feature/videoThunk";
import { subscribeChannel } from "../feature/userThunk";

const initialState: VideoInitailState = {
  videos: [],
  subscriptionVideos: [],
  nextPage: 0,
  hasMore: true,
  watchingVideo: null,
  likedVideo: [],
  recommendedVideos: [],
  videosOfUser: [],
  watchedVideo: [],
  homeVideos: null,
  statusCreating: "idle",
  status: "idle",
  statusReaction: "idle",
  statusFetchingVideos: "idle",
  statusSubscribe: "idle",
  statusDelete: "idle",
  statusUpdate: "idle",
};

export const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getSubscriptionVideos.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getSubscriptionVideos.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.subscriptionVideos = action.payload.videos;
      })
      .addCase(getSubscriptionVideos.rejected, (state) => {
        state.status = "failed";
      });

    builder
      .addCase(getSearchVideos.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getSearchVideos.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.videos = action.payload.videos;
      })
      .addCase(getSearchVideos.rejected, (state) => {
        state.status = "failed";
      });

    builder
      .addCase(deleteWatchedVideo.pending, (state) => {
        state.statusDelete = "loading";
      })
      .addCase(deleteWatchedVideo.fulfilled, (state, action) => {
        state.statusDelete = "succeeded";
        state.watchedVideo.filter((vid) => vid._id === action.payload);
      })
      .addCase(deleteWatchedVideo.rejected, (state) => {
        state.statusDelete = "failed";
      });

    builder
      .addCase(insertWatchedVideo.pending, (state) => {
        state.statusUpdate = "loading";
      })
      .addCase(insertWatchedVideo.fulfilled, (state, action) => {
        state.statusUpdate = "succeeded";
        state.watchedVideo.push(action.payload);
      })
      .addCase(insertWatchedVideo.rejected, (state) => {
        state.statusUpdate = "failed";
      });

    builder
      .addCase(getHistoryWatchedVideos.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getHistoryWatchedVideos.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.watchedVideo = action.payload;
      })
      .addCase(getHistoryWatchedVideos.rejected, (state) => {
        state.status = "failed";
      });

    builder
      .addCase(getHomepageVideos.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getHomepageVideos.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.homeVideos = action.payload;
      })
      .addCase(getHomepageVideos.rejected, (state) => {
        state.status = "failed";
      });

    builder
      .addCase(getLikedVideo.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getLikedVideo.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.likedVideo = action.payload;
      })
      .addCase(getLikedVideo.rejected, (state) => {
        state.status = "failed";
      });

    builder
      .addCase(editVideo.pending, (state) => {
        state.statusUpdate = "loading";
      })
      .addCase(editVideo.fulfilled, (state) => {
        state.statusUpdate = "succeeded";
      })
      .addCase(editVideo.rejected, (state) => {
        state.statusUpdate = "failed";
      });

    builder
      .addCase(deleteVideo.pending, (state) => {
        state.statusDelete = "loading";
      })
      .addCase(deleteVideo.fulfilled, (state, action) => {
        state.statusDelete = "succeeded";
        state.videosOfUser.filter((video) => video._id === action.payload);
      })
      .addCase(deleteVideo.rejected, (state) => {
        state.statusDelete = "failed";
      });

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
      .addCase(getAllVideos.pending, (state, action) => {
        if (state.status === "loading") return;
        state.status = "loading";
        if (action.meta.arg.page === "0") {
          state.videos = [];
          state.hasMore = true;
          state.nextPage = 0;
        }
      })
      .addCase(getAllVideos.fulfilled, (state, action) => {
        state.status = "succeeded";
        const existingIds = new Set(state.videos.map((v) => v._id));
        const newVideos = action.payload.videos.filter(
          (v) => !existingIds.has(v._id),
        );

        state.videos = [...state.videos, ...newVideos];
        state.nextPage = action.payload.nextPage ?? null;
        state.hasMore = action.payload.nextPage !== null;
      })
      .addCase(getAllVideos.rejected, (state) => {
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
