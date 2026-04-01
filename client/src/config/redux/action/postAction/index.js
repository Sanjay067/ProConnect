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

export const getFeed = createAsyncThunk("feed/posts", async (_, thunkAPI) => {
  try {
    const { data } = await clientApi.get("/feed", { params: { page: 1, limit: 20 } });
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
      const { data } = await clientApi.post("/posts/", postData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || error.message,
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

export const editPost = createAsyncThunk(
  "post/edit",
  async ({ postId, postData }, thunkAPI) => {
    try {
      const { data } = await clientApi.patch(`/posts/${postId}`, postData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return { postId, ...data };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: error.message },
      );
    }
  },
);

export const deletePost = createAsyncThunk(
  "post/delete",
  async (postId, thunkAPI) => {
    try {
      const { data } = await clientApi.delete(`/posts/${postId}`);
      return { postId, ...data };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: error.message },
      );
    }
  },
);
