import { createSlice } from "@reduxjs/toolkit";
import type { userInitialState } from "../types/userInterface";

const initialState: userInitialState = {
  subscription: [],
  status: "idle",
  statusSubscribe: "idle",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  // extraReducers(builder) {},
});

export default userSlice.reducer;
