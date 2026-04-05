import clientApi from "@/services/clientApi";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getConnectionsOverview = createAsyncThunk(
  "connections/overview",
  async (_, thunkAPI) => {
    try {
      const { data } = await clientApi.get("/connections/overview");
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: error.message },
      );
    }
  },
);

export const getMyConnections = createAsyncThunk(
  "connections/All",
  async (_, thunkAPI) => {
    try {
      const { data } = await clientApi.get("/connections/me");
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: error.message },
      );
    }
  },
);

export const sendConnections = createAsyncThunk(
  "connections/send",
  async (receiverId, thunkAPI) => {
    try {
      const { data } = await clientApi.post(`/connections/${receiverId}`);
      thunkAPI.dispatch(getConnectionsOverview());
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: error.message },
      );
    }
  },
);

export const acceptConnections = createAsyncThunk(
  "connections/accept",
  async (connectionId, thunkAPI) => {
    try {
      const { data } = await clientApi.patch(
        `/connections/${connectionId}/accept`,
      );
      thunkAPI.dispatch(getConnectionsOverview());
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: error.message },
      );
    }
  },
);

export const rejectConnections = createAsyncThunk(
  "connections/reject",
  async (connectionId, thunkAPI) => {
    try {
      const { data } = await clientApi.patch(
        `/connections/${connectionId}/reject`,
      );
      thunkAPI.dispatch(getConnectionsOverview());
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: error.message },
      );
    }
  },
);

export const cancelPendingConnection = createAsyncThunk(
  "connections/cancelPending",
  async (connectionId, thunkAPI) => {
    try {
      const { data } = await clientApi.delete(
        `/connections/pending/${connectionId}`,
      );
      thunkAPI.dispatch(getConnectionsOverview());
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: error.message },
      );
    }
  },
);

export const removeAcceptedConnection = createAsyncThunk(
  "connections/removeAccepted",
  async (connectionId, thunkAPI) => {
    try {
      const { data } = await clientApi.delete(
        `/connections/accepted/${connectionId}`,
      );
      thunkAPI.dispatch(getConnectionsOverview());
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: error.message },
      );
    }
  },
);
