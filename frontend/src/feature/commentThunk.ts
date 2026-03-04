import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../lib/axios";
import type { CommentInfo } from "../types/commentInterface";

export const getComments = createAsyncThunk<
  CommentInfo[],
  { id: string },
  { rejectValue: string }
>("comment/getComments", async ({ id }, { rejectWithValue }) => {
  try {
    const result = await axiosInstance.get(`/comment/${id}`);
    return result.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Error");
  }
});

export const postComment = createAsyncThunk<
  CommentInfo,
  {
    id: string;
    content: string;
    imageFile: File | null;
    type: "Video" | "Blog";
  },
  { rejectValue: string }
>(
  "comment/postComment",
  async ({ id, content, imageFile, type }, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      formData.append("content", content);
      formData.append("onModel", type);
      if (imageFile) formData.append("imageCmt", imageFile);

      const result = await axiosInstance.post(`/comment/post/${id}`, formData);
      return result.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Error");
    }
  },
);

export const deleteComment = createAsyncThunk<
  string,
  { id: string },
  { rejectValue: string }
>("comment/deleteComment", async ({ id }, { rejectWithValue }) => {
  try {
    const result = await axiosInstance.delete(`/comment/del/${id}`);
    return result.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Error");
  }
});
