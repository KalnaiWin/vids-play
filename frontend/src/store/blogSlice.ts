import { createSlice } from "@reduxjs/toolkit";
import type { BlogInitialState } from "../types/blogInterface";
import { deleteBlog, getBlogs, uploadBlog } from "../feature/blogThunk";

const initialState: BlogInitialState = {
  blogs: [],
  status: "idle",
  uploadStatus: "idle",
  deleteStatus: "idle",
};

export const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {},
  extraReducers(builder) {
    // Delete blog
    builder
      .addCase(deleteBlog.pending, (state) => {
        state.deleteStatus = "loading";
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";
        state.blogs.filter((blog) => blog._id === action.payload);
      })
      .addCase(deleteBlog.rejected, (state) => {
        state.deleteStatus = "failed";
      });

    // Upload blog
    builder
      .addCase(uploadBlog.pending, (state) => {
        state.uploadStatus = "loading";
      })
      .addCase(uploadBlog.fulfilled, (state, action) => {
        state.uploadStatus = "succeeded";
        state.blogs.push(action.payload);
      })
      .addCase(uploadBlog.rejected, (state) => {
        state.uploadStatus = "failed";
      });

    // Get blogs
    builder
      .addCase(getBlogs.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getBlogs.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.blogs = action.payload;
      })
      .addCase(getBlogs.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default blogSlice.reducer;
