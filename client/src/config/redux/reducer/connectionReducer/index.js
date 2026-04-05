import { createSlice } from "@reduxjs/toolkit";
import {
  getMyConnections,
  getConnectionsOverview,
  sendConnections,
  acceptConnections,
  rejectConnections,
  cancelPendingConnection,
  removeAcceptedConnection,
} from "../../action/connectionAction";

const initialState = {
  connections: [],
  overview: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

const connectionSlice = createSlice({
  name: "connection",
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMyConnections.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMyConnections.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.connections = action.payload.connections || [];
      })
      .addCase(getMyConnections.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message || action.payload;
      })

      .addCase(getConnectionsOverview.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getConnectionsOverview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.overview = action.payload;
        state.connections = action.payload.accepted || [];
      })
      .addCase(getConnectionsOverview.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message || action.payload;
      })

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
      })

      .addCase(cancelPendingConnection.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload?.message || "Request cancelled";
      })
      .addCase(removeAcceptedConnection.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload?.message || "Connection removed";
      });
  },
});

export const { reset } = connectionSlice.actions;
export default connectionSlice.reducer;
