import clientApi from "@/services/clientApi";
import { createAsyncThunk } from "@reduxjs/toolkit";

// LOGIN
export const loginUser = createAsyncThunk(
  "user/login",
  async (user, thunkAPI) => {
    try {
      const { data } = await clientApi.post("/auth/login", {
        email: user.email,
        password: user.password,
      });
      console.log("Login response:", data);
      return data;
    } catch (error) {
      console.log("Login error:", error.response?.data);
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: error.message },
      );
    }
  },
);

// Register
export const registerUser = createAsyncThunk(
  "user/register",
  async (user, thunkAPI) => {
    try {
      const { data } = await clientApi.post("/auth/signup", {
        email: user.email,
        password: user.password,
        name: user.name,
        username: user.username,
        confirmPassword: user.confirmPassword,
      });
      console.log("Signup response:", data);
      return data;
    } catch (error) {
      console.log("Signup error:", error.response?.data);
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: error.message },
      );
    }
  },
);

// Logout
export const logoutUser = createAsyncThunk(
  "user/logout",
  async (_, thunkAPI) => {
    try {
      const { data } = await clientApi.post("/auth/logout");
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: error.message },
      );
    }
  },
);
