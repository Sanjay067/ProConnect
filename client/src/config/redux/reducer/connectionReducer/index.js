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
  initialLoading: true,
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
      .addCase(getMyConnections.fulfilled, (state, action) => {
        state.initialLoading = false;
        state.isSuccess = true;
        state.connections = action.payload.connections || [];
      })
      .addCase(getMyConnections.rejected, (state, action) => {
        state.initialLoading = false;
        state.isError = true;
        state.message = action.payload?.message || action.payload;
      })

      .addCase(getConnectionsOverview.fulfilled, (state, action) => {
        state.initialLoading = false;
        state.isSuccess = true;
        state.overview = action.payload;
        state.connections = action.payload.accepted || [];
      })
      .addCase(getConnectionsOverview.rejected, (state, action) => {
        state.initialLoading = false;
        state.isError = true;
        state.message = action.payload?.message || action.payload;
      })

      .addCase(sendConnections.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.message = action.payload?.message || "Connection request sent";
      })
      .addCase(sendConnections.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload?.message || action.payload;
      })

      .addCase(acceptConnections.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.message = action.payload?.message || "Connection accepted";
      })
      .addCase(acceptConnections.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload?.message || action.payload;
      })

      .addCase(rejectConnections.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.message = action.payload?.message || "Connection rejected";
      })
      .addCase(rejectConnections.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload?.message || action.payload;
      })

      .addCase(cancelPendingConnection.fulfilled, (state, action) => {
        state.message = action.payload?.message || "Request cancelled";
      })
      .addCase(removeAcceptedConnection.fulfilled, (state, action) => {
        state.message = action.payload?.message || "Connection removed";
      });
  },
});

export const { reset } = connectionSlice.actions;
export default connectionSlice.reducer;
