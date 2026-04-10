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

export const checkIsReadNotification = createAsyncThunk<
  NotificationInfo,
  { id: string },
  { rejectValue: string }
>(
  "/notification/checkIsReadNotification",
  async ({ id }, { rejectWithValue }) => {
    try {
      const result = await axiosInstance.put(`notification/${id}`);
      return result.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Error");
    }
  },
);

export const checkHasUnReadNotification = createAsyncThunk<
  boolean,
  void,
  { rejectValue: string }
>(
  "/notification/checkHasUnReadNotification",
  async (_, { rejectWithValue }) => {
    try {
      const result = await axiosInstance.get(`notification/not-read`);
      return result.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Error");
    }
  },
);

export const deleteNotification = createAsyncThunk<
  string,
  { id: string },
  { rejectValue: string }
>("/notification/deleteNotification", async ({ id }, { rejectWithValue }) => {
  try {
    const result = await axiosInstance.delete(`notification/del/${id}`);
    return result.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Error");
  }
});
