import { createSlice } from "@reduxjs/toolkit";
import {
  changeStatusRoom,
  createRoom,
  deleteRoom,
  fetchStreamingRooms,
  fetchStreamingRoomsOfUser,
  joinRoom,
  toggleReactionRoom,
} from "../feature/roomThunk";
import type { RoomInitialState } from "../types/roomInterface";

const initialState: RoomInitialState = {
  streamingRoom: null,
  rooms: [],
  myRooms: [],
  status: "idle",
  createStatus: "idle",
  statusReaction: "idle",
  statusDelete: "idle",
  statusUpdate: "idle",
};

export const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {},
  extraReducers(builder) {
    // Change room status
    builder
      .addCase(changeStatusRoom.pending, () => {
        // state.statusUpdate = "loading";
      })
      .addCase(changeStatusRoom.fulfilled, (state, action) => {
        state.statusUpdate = "succeeded";
        if (state.streamingRoom) {
          state.streamingRoom.status = action.payload.status;
        }
      })
      .addCase(changeStatusRoom.rejected, (state) => {
        state.statusUpdate = "failed";
      });

    // Delete room
    builder
      .addCase(deleteRoom.pending, (state) => {
        state.statusDelete = "loading";
      })
      .addCase(deleteRoom.fulfilled, (state, action) => {
        state.statusDelete = "succeeded";
        state.rooms.filter((room) => room._id === action.payload);
      })
      .addCase(deleteRoom.rejected, (state) => {
        state.statusDelete = "failed";
      });

    // Create room
    builder
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

    // Fetch rooms of user
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

    // Reaction to room
    builder
      .addCase(toggleReactionRoom.pending, (state) => {
        state.statusReaction = "loading";
      })
      .addCase(toggleReactionRoom.fulfilled, (state, action) => {
        state.statusReaction = "succeeded";
        if (state.streamingRoom) {
          state.streamingRoom.likes = action.payload.likes;
          state.streamingRoom.dislikes = action.payload.dislikes;
        }
      })
      .addCase(toggleReactionRoom.rejected, (state) => {
        state.statusReaction = "failed";
      });
  },
});

export default roomSlice.reducer;
