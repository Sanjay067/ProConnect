import { createSlice } from "@reduxjs/toolkit";
import {
  getUserProfile,
  getAllProfiles,
  updateProfile,
  updateProfilePicture,
} from "../../action/profileAction";

const initialState = {
  profile: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
  profileFetched: false,
  allProfiles: [],
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserProfile.pending, (state) => {
        state.isLoading = true;
        state.message = "Fetching profile....";
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.message = "Profile fetched successfully";
        state.profile = action.payload;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message || action.payload;
      })
      // Get all profiles cases
      .addCase(getAllProfiles.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllProfiles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.allProfiles = action.payload; // Store the array of people here
      })
      .addCase(getAllProfiles.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message || "Failed to fetch profiles";
      })
      // Update profile cases
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // Merge the updated profileData with whatever was already in state.profile
        state.profile = { ...state.profile, ...action.payload.userProfile };
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message || "Failed to update profile";
      })
      // Update profile picture cases
      .addCase(updateProfilePicture.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProfilePicture.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // The profile object contains a populated `userId` object with the avatar
        if (state.profile?.userId) {
          state.profile.userId.profilePicture = action.payload.profilePicture;
        }
      })
      .addCase(updateProfilePicture.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message || "Failed to update picture";
      });
  },
});

export const { reset } = profileSlice.actions;
export default profileSlice.reducer;
