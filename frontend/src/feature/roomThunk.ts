import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../lib/axios";
import { toast } from "react-toastify";
import type { RoomInfo, RoomStreamingInfo } from "../types/roomInterface";
import type { ReactionResponse } from "../types/videoInterface";

export const createRoom = createAsyncThunk<
  RoomInfo,
  { title: string; thumbnail: File | null },
  { rejectValue: string }
>("/room/createRoom", async ({ title, thumbnail }, { rejectWithValue }) => {
  try {
    const formData = new FormData();

    formData.append("title", title);
    if (thumbnail) formData.append("thumbnail", thumbnail);
    const result = await axiosInstance.post("/room/create", formData);
    toast.success("Tạo phòng live stream thành công");
    return result.data;
  } catch (error: any) {
    toast.error("Tạo phòng live stream thất bại");
    return rejectWithValue(error.response?.data || "Error");
  }
});

export const joinRoom = createAsyncThunk<
  RoomStreamingInfo,
  { id: string },
  { rejectValue: string }
>("/room/joinRoom", async ({ id }, { rejectWithValue }) => {
  try {
    const result = await axiosInstance.get(`/room/join/${id}`);
    return result.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Error");
  }
});

export const fetchStreamingRooms = createAsyncThunk<
  RoomInfo[],
  void,
  { rejectValue: string }
>("/room/fetchStreamingRooms", async (_, { rejectWithValue }) => {
  try {
    const result = await axiosInstance.get(`/room/stream`);
    return result.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Error");
  }
});

export const fetchStreamingRoomsOfUser = createAsyncThunk<
  RoomInfo[],
  { id: string },
  { rejectValue: string }
>("/room/fetchStreamingRoomsOfUser", async ({ id }, { rejectWithValue }) => {
  try {
    const result = await axiosInstance.get(`/room/stream/${id}`);
    return result.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Error");
  }
});

export const toggleReactionRoom = createAsyncThunk<
  ReactionResponse,
  { id: string; type: "like" | "dislike" },
  { rejectValue: string }
>("video/toggleReactionRoom", async ({ type, id }, { rejectWithValue }) => {
  try {
    const result = await axiosInstance.post(`/room/reaction/${id}`, { type });
    return result.data as ReactionResponse;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Error");
  }
});
