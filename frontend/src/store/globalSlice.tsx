import { createSlice } from "@reduxjs/toolkit";
import type { GlobalState } from "../types/globalInterface";

const initialState: GlobalState = {
  statusNavBar: true,
  statusSearch: false,
  statusNavBarReponsive: false,
  statusAuth: "idle",
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    toggleNavBar: (state) => {
      state.statusNavBar = !state.statusNavBar;
    },
    closeSearch: (state) => {
      state.statusSearch = false;
    },
    toggleSearch: (state) => {
      state.statusSearch = !state.statusSearch;
    },
    toogleNavBarResponsive: (state) => {
      state.statusNavBarReponsive = !state.statusNavBarReponsive;
    },
    selectLogin: (state) => {
      state.statusAuth = "login";
    },
    selectRegister: (state) => {
      state.statusAuth = "register";
    },
    resetSelect: (state) => {
      state.statusAuth = "idle";
    },
  },
});

export const {
  toggleNavBar,
  toggleSearch,
  closeSearch,
  toogleNavBarResponsive,
  selectRegister,
  selectLogin,
  resetSelect,
} = globalSlice.actions;
export default globalSlice.reducer;
