import clientApi from "@/services/clientApi";
import { createAsyncThunk } from "@reduxjs/toolkit";

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
  "connetions/send",
  async (receiverId, thunkAPI) => {
    try {
      const { data } = await clientApi.post(`connections/${receiverId}`);
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
  async (requestId, thunkAPI) => {
    try {
      const { data } = await clientApi.patch(`connections/${requestId}/accept`);
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
  async (requestId, thunkAPI) => {
    try {
      const { data } = await clientApi.patch(
        `connections/${requestId}/reject/`,
      );
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: error.message },
      );
    }
  },
);
