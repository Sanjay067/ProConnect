import clientApi from "@/services/clientApi";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getPosts = createAsyncThunk("user/posts", async (_, thunkAPI) => {
  try {
    const { data } = await clientApi.get("/posts");
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error.response?.data || { message: error.message },
    );
  }
});

export const createPost = createAsyncThunk(
  "user/createPost",
  async (postData, thunkAPI) => {
    try {
      const { data } = await clientApi.post("/posts/", postData);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || message.response?.data,
      );
    }
  },
);

export const toggleLikePost = createAsyncThunk(
  "post/toggleLike",
  async (postId, thunkAPI) => {
    try {
      const { data } = await clientApi.post(`/posts/${postId}/like`);
      return { postId, ...data };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: error.message },
      );
    }
  },
);
