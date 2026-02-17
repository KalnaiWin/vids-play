import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../lib/axios";
import { toast } from "react-toastify";

export const subscribeChannel = createAsyncThunk<
  any,
  { id: string },
  { rejectValue: string }
>("video/subscribeChannel", async ({ id }, { rejectWithValue }) => {
  try {
    const result = await axiosInstance.post(`/user/subscribe/${id}`);
    toast.success(
      `Đã ${result.data.subscribed ? "" : "hủy "}đăng kí thành công`,
    );
    return result.data;
  } catch (error: any) {
    toast.error("Đã đăng kí thất bại");
    return rejectWithValue(error.response?.data || "Error");
  }
});
