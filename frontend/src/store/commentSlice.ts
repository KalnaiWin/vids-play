import { createSlice } from "@reduxjs/toolkit";
import type { CommentInitialState } from "../types/commentInterface";
import {
  deleteComment,
  getComments,
  postComment,
} from "../feature/commentThunk";

const initialState: CommentInitialState = {
  comments: [],
  status: "idle",
  postStatus: "idle",
  deleteStatus: "idle",
};

export const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {},
  extraReducers(builder) {
    // Get comments
    builder
      .addCase(getComments.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getComments.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.comments = action.payload;
      })
      .addCase(getComments.rejected, (state) => {
        state.status = "failed";
      });

    // Post comments
    builder
      .addCase(postComment.pending, (state) => {
        state.postStatus = "loading";
      })
      .addCase(postComment.fulfilled, (state, action) => {
        state.postStatus = "succeeded";
        state.comments.push(action.payload);
      })
      .addCase(postComment.rejected, (state) => {
        state.postStatus = "failed";
      });

    // Delete comments
    builder
      .addCase(deleteComment.pending, (state) => {
        state.deleteStatus = "loading";
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";
        state.comments.filter((cmt) => cmt._id === action.payload);
      })
      .addCase(deleteComment.rejected, (state) => {
        state.deleteStatus = "failed";
      });
  },
});

export default commentSlice.reducer;
