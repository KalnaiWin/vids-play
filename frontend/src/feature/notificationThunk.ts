import { createAsyncThunk } from "@reduxjs/toolkit";
import type { NotificationInfo } from "../types/notificationInterface";
import axiosInstance from "../lib/axios";

export const getNotificationsOfuser = createAsyncThunk<
  NotificationInfo[],
  void,
  { rejectValue: string }
>("/notification/getNotificationsOfuser", async (_, { rejectWithValue }) => {
  try {
    const result = await axiosInstance.get(`notification`);
    return result.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Error");
  }
});
