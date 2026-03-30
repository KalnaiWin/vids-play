import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../lib/axios";
import { toast } from "react-toastify";
import type { CurrentChannel, Subscription } from "../types/userInterface";

export const subscribeChannel = createAsyncThunk<
  any,
  { id: string; notification: string },
  { rejectValue: string }
>(
  "video/subscribeChannel",
  async ({ id, notification }, { rejectWithValue }) => {
    try {
      const result = await axiosInstance.post(`/user/subscribe/${id}`, {
        notification,
      });
      const { subscribed } = result.data;

      if (subscribed) {
        if (notification === "all") {
          toast.success("Đã đăng ký và bật tất cả thông báo 🔔");
        } else if (notification === "none") {
          toast.success("Đã đăng ký kênh");
        }
      } else {
        toast.success("Đã hủy đăng ký kênh");
      }

      return result.data;
    } catch (error: any) {
      toast.error("Đã đăng kí thất bại");
      return rejectWithValue(error.response?.data || "Error");
    }
  },
);

export const fetchSubscriptions = createAsyncThunk<
  Subscription[],
  void,
  { rejectValue: string }
>("video/fetchSubscriptions", async (_, { rejectWithValue }) => {
  try {
    const result = await axiosInstance.get(`/user/subscription`);
    return result.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Error");
  }
});

export const getChannelUser = createAsyncThunk<
  CurrentChannel,
  { id: string },
  { rejectValue: string }
>("video/getChannelUser", async ({ id }, { rejectWithValue }) => {
  try {
    const result = await axiosInstance.get(`/user/channel/${id}`);
    return result.data[0];
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Error");
  }
});

export const updateProfileChannel = createAsyncThunk<
  any,
  { description: string; avatar: File | null },
  { rejectValue: string }
>(
  "video/updateProfileChannel",
  async ({ description, avatar }, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      formData.append("description", description);
      if (avatar) {
        formData.append("avatarUrl", avatar);
      }
      const result = await axiosInstance.put("/user/channel", formData);
      toast.success("Cập nhật thành công");
      return result.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Error");
    }
  },
);