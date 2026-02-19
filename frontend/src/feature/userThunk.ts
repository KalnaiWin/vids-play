import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../lib/axios";
import { toast } from "react-toastify";

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
