import { createSlice } from "@reduxjs/toolkit";
import {
  getMyConnections,
  sendConnections,
  acceptConnections,
  rejectConnections,
} from "../../action/connectionAction.js";

const initialState = {
  connections: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

const connectonSlice = createSlice({
  name: "connctions",
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // GET MY CONNECTIONS
      .addCase(getMyConnections.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMyConnections.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // The API returns { message, connections: [...] }
        state.connections = action.payload.connections || [];
      })
      .addCase(getMyConnections.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message || action.payload;
      })

      // SEND CONNECTION
      .addCase(sendConnections.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(sendConnections.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload?.message || "Connection request sent";
      })
      .addCase(sendConnections.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message || action.payload;
      })

      // ACCEPT CONNECTION
      .addCase(acceptConnections.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(acceptConnections.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload?.message || "Connection accepted";
      })
      .addCase(acceptConnections.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message || action.payload;
      })

      // REJECT CONNECTION
      .addCase(rejectConnections.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(rejectConnections.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload?.message || "Connection rejected";
      })
      .addCase(rejectConnections.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message || action.payload;
      });
  },
});

export const { reset } = connectonSlice.actions;
export default connectonSlice.reducer;
