import { createAsyncThunk } from "@reduxjs/toolkit";
import type { BlogsInfo, BlogUpload } from "../types/blogInterface";
import axiosInstance from "../lib/axios";
import { toast } from "react-toastify";
import type { ReactionResponse } from "../types/videoInterface";

export const uploadBlog = createAsyncThunk<
  BlogsInfo,
  { data: BlogUpload; imageBlog: File | null },
  { rejectValue: string }
>("blog/uploadBlog", async ({ data, imageBlog }, { rejectWithValue }) => {
  try {
    const formData = new FormData();

    formData.append("description", data.description);
    formData.append("types", JSON.stringify(data.types));
    formData.append("status", data.status);
    if (imageBlog) formData.append("image_blog", imageBlog);
    console.log(formData);

    const result = await axiosInstance.post("/blog/upload", formData);
    toast.success("Đăng bài viết thành công");
    return result.data;
  } catch (error: any) {
    toast.error("Đăng bài viết thất bại");
    return rejectWithValue(error.response?.data || "Error");
  }
});

export const getBlogs = createAsyncThunk<
  BlogsInfo[],
  { id: string },
  { rejectValue: string }
>("blog/getBlogs", async ({ id }, { rejectWithValue }) => {
  try {
    const result = await axiosInstance.get(`/blog/channel/${id}`);
    return result.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Error");
  }
});

export const deleteBlog = createAsyncThunk<
  string,
  { id: string },
  { rejectValue: string }
>("blog/deleteBlog", async ({ id }, { rejectWithValue }) => {
  try {
    const result = await axiosInstance.delete(`/blog/del/${id}`);
    toast.success("Xóa bài viết thành công");
    return result.data;
  } catch (error: any) {
    toast.error("Xóa bài viết thất bại");
    return rejectWithValue(error.response?.data || "Error");
  }
});

export const toggleReactBlog = createAsyncThunk<
  ReactionResponse,
  { id: string; type: "like" | "dislike" },
  { rejectValue: string }
>("blog/toggleReactBlog", async ({ id, type }, { rejectWithValue }) => {
  try {
    console.log(type);

    const result = await axiosInstance.put(`/blog/react/${id}`, { type });
    return result.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Error");
  }
});

export const getBlogDetail = createAsyncThunk<
  BlogsInfo,
  { id: string },
  { rejectValue: string }
>("blog/getBlogDetail", async ({ id }, { rejectWithValue }) => {
  try {
    const result = await axiosInstance.get(`/blog/${id}`);
    return result.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Error");
  }
});
