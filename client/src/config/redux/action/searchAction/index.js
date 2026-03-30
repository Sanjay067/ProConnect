import { createAsyncThunk } from "@reduxjs/toolkit";
import clientApi from "@/services/clientApi";

export const searchUsers = createAsyncThunk(
  "search/users",
  async (query, thunkAPI) => {
    try {
      if (!query || !query.trim()) return [];

      const { data } = await clientApi.get("/users/search", {
        params: { q: query },
      });

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: error.message },
      );
    }
  }
);
