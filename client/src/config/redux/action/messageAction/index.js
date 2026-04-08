import clientApi from "@/services/clientApi";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getConversations = createAsyncThunk(
  "messages/getConversations",
  async (_, thunkAPI) => {
    try {
      const { data } = await clientApi.get("/messages/conversations");
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: error.message },
      );
    }
  },
);

export const getMessagesByPeer = createAsyncThunk(
  "messages/getMessagesByPeer",
  async (peerId, thunkAPI) => {
    try {
      const { data } = await clientApi.get(`/messages/${peerId}`);
      return { peerId, ...data };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: error.message, peerId },
      );
    }
  },
);

export const sendMessage = createAsyncThunk(
  "messages/sendMessage",
  async ({ peerId, body }, thunkAPI) => {
    try {
      const { data } = await clientApi.post(`/messages/${peerId}`, { body });
      return { peerId, ...data };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: error.message, peerId },
      );
    }
  },
);
