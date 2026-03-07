import { createSlice } from "@reduxjs/toolkit";
import type { RoomInitialState } from "../types/roominterface";
import {
  createRoom,
  fetchStreamingRooms,
  fetchStreamingRoomsOfUser,
  joinRoom,
} from "../feature/roomThunk";

const initialState: RoomInitialState = {
  streamingRoom: null,
  rooms: [],
  myRooms: [],
  status: "idle",
  createStatus: "idle",
};

export const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      // Create room
      .addCase(createRoom.pending, (state) => {
        state.createStatus = "loading";
      })
      .addCase(createRoom.fulfilled, (state, action) => {
        state.createStatus = "succeeded";
        state.rooms.push(action.payload);
      })
      .addCase(createRoom.rejected, (state) => {
        state.createStatus = "failed";
      });

    // Join room
    builder
      .addCase(joinRoom.pending, (state) => {
        state.status = "loading";
      })
      .addCase(joinRoom.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.streamingRoom = action.payload;
      })
      .addCase(joinRoom.rejected, (state) => {
        state.status = "failed";
      });

    // Fetch rooms
    builder
      .addCase(fetchStreamingRooms.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchStreamingRooms.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.rooms = action.payload;
      })
      .addCase(fetchStreamingRooms.rejected, (state) => {
        state.status = "failed";
      });

    // Fetch rooms
    builder
      .addCase(fetchStreamingRoomsOfUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchStreamingRoomsOfUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.myRooms = action.payload;
      })
      .addCase(fetchStreamingRoomsOfUser.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default roomSlice.reducer;
