import {
  createSlice,
  isFulfilled,
  isPending,
  isRejected,
} from "@reduxjs/toolkit";
import type { authInitialState } from "../types/authInterface";
import { fetchUser, login, logout, register } from "../feature/authThunk";

const initialState: authInitialState = {
  user: null,
  status: "idle",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.status = "idle";
    },
  },
  extraReducers(builder) {
    builder
      .addCase(logout.pending, (state) => {
        state.status = "loading";
      })
      .addCase(logout.fulfilled, (state) => {
        state.status = "succeeded";
        state.user = null;
      })
      .addCase(logout.rejected, (state) => {
        state.status = "failed";
      })

      .addMatcher(isPending(fetchUser, login, register), (state) => {
        state.status = "loading";
      })
      .addMatcher(isFulfilled(fetchUser, login, register), (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addMatcher(isRejected(fetchUser, login, register), (state) => {
        state.status = "failed";
      });
  },
});

export default authSlice.reducer;
