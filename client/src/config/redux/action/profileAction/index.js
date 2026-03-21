import clientApi from "@/services/clientApi";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getUserProfile = createAsyncThunk(
  "user/profile",
  async (user, thunkAPI) => {
    try {
      const { data } = await clientApi.get("/users/profiles/me");
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || {
          message: error.message,
        },
      );
    }
  },
);

export const getAllProfiles = createAsyncThunk(
  "user/allProfiles",
  async (_, thunkAPI) => {
    try {
      const { data } = await clientApi.get("/users/profiles");
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || {
          message: error.message,
        },
      );
    }
  },
);

export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (profileData, thunkAPI) => {
    try {
      const { data } = await clientApi.patch("/users/profiles/me", profileData);
      return data; // Returns { message, userProfile }
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || {
          message: error.message,
        },
      );
    }
  },
);

export const updateProfilePicture = createAsyncThunk(
  "user/updateProfilePicture",
  async (formData, thunkAPI) => {
    try {
      const { data } = await clientApi.patch(
        "/users/profiles/me/avatar",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: error.message },
      );
    }
  },
);
