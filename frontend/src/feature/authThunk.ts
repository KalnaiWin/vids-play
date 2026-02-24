import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../lib/axios";
import type {
  loginInputAndGlobalOutput,
  registerInput,
} from "../types/authInterface";
import { toast } from "react-toastify";

export const fetchUser = createAsyncThunk(
  "auth/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/auth/me");
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Error");
    }
  },
);

export const register = createAsyncThunk<
  loginInputAndGlobalOutput,
  registerInput,
  { rejectValue: string }
>("auth/register", async (data, { dispatch, rejectWithValue }) => {
  try {
    const res = await axiosInstance.post("/auth/register", data);
    dispatch(fetchUser());
    toast.success("Đăng ký thành công, Chúc bạn vui vẻ 😊");
    return res.data;
  } catch (error: any) {
    toast.error("Đăng ký thất bại");
    return rejectWithValue(error.response?.data || "Error");
  }
});

export const login = createAsyncThunk<
  loginInputAndGlobalOutput,
  loginInputAndGlobalOutput,
  { rejectValue: string }
>("auth/login", async (data, { dispatch, rejectWithValue }) => {
  try {
    const res = await axiosInstance.post("/auth/login", data);
    dispatch(fetchUser());
    toast.success("Đăng nhập thành công. Chào mừng bạn trở lại 😄");
    return res.data;
  } catch (error: any) {
    toast.error("Đăng nhập thất bại");
    return rejectWithValue(error.response?.data || "Error");
  }
});

export const logout = createAsyncThunk<void, void, { rejectValue: string }>(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/logout");
      toast.success("Đăng xuất thành công. Hẹn gặp lại 👋");
      return res.data;
    } catch (error: any) {
      toast.error("Đăng xuất thất bại");
      return rejectWithValue(error.response?.data || "Error");
    }
  },
);
