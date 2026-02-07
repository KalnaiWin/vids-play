import { createSlice } from "@reduxjs/toolkit";
import type { GlobalState } from "../types/globalInterface";

const initialState: GlobalState = {
  statusNavBar: true,
  statusSearch: false,
  statusNavBarReponsive: false,
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
  },
});

export const {
  toggleNavBar,
  toggleSearch,
  closeSearch,
  toogleNavBarResponsive,
} = globalSlice.actions;
export default globalSlice.reducer;
