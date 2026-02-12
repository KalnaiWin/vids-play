import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  type RecommendVideos,
  type UploadFiles,
  type VideoInfo,
  type VideoInput,
  type VideoWatchingInfo,
} from "../types/videoInterface";
import axiosInstance from "../lib/axios";
import { toast } from "react-toastify";

export const uploadVideo = createAsyncThunk<
  VideoInfo,
  { data: VideoInput; file: UploadFiles },
  { rejectValue: string }
>("video/uploadVideo", async ({ data, file }, { rejectWithValue }) => {
  try {
    if (!file.thumbnailUrl || !file.videoUrl) {
      return rejectWithValue("Thiếu file video hoặc thumbnail");
    }
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("duration", String(data.duration));
    formData.append("visibility", data.visibility);
    formData.append("thumbnailUrl", file.thumbnailUrl);
    formData.append("videoUrl", file.videoUrl);

    const result = await axiosInstance.post("/video/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    toast.success("Đăng video thành công");
    return result.data;
  } catch (error: any) {
    toast.error("Đăng video thất bại");
    return rejectWithValue(error.response?.data || "Error");
  }
});

export const getAllVieos = createAsyncThunk<
  VideoInfo[],
  void,
  { rejectValue: string }
>("video/getAllVideos", async (_, { rejectWithValue }) => {
  try {
    const result = await axiosInstance.get("/video");
    return result.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Error");
  }
});

export const watchVieo = createAsyncThunk<
  VideoWatchingInfo,
  { id: string },
  { rejectValue: string }
>("video/watchVieo", async ({ id }, { rejectWithValue }) => {
  try {
    const result = await axiosInstance.get(`/video/${id}`);
    return result.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Error");
  }
});

export const recommendVideos = createAsyncThunk<
  RecommendVideos[],
  { id: string },
  { rejectValue: string }
>("video/recommendVideos", async ({ id }, { rejectWithValue }) => {
  try {
    const result = await axiosInstance.get(`/video/recommend/${id}`);
    return result.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Error");
  }
});
