import { createSlice } from "@reduxjs/toolkit";
import type { GlobalState } from "../types/globalInterface";

const initialState: GlobalState = {
  search: "",
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
    search: (state, action) => {
      state.search = action.payload;
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
  search,
  selectLogin,
  resetSelect,
} = globalSlice.actions;
export default globalSlice.reducer;
