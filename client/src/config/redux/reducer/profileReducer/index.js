import { createSlice } from "@reduxjs/toolkit";
import {
  getUserProfile,
  getAllProfiles,
  updateProfile,
  updateProfilePicture,
  updateBannerPicture,
} from "../../action/profileAction";

const initialState = {
  profile: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
  profileFetched: false,
  allProfiles: [],
  profilesPagination: {
    page: 1,
    limit: 24,
    total: 0,
    hasMore: false,
  },
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
        state.profileFetched = true;
        state.message = "Profile fetched successfully";
        state.profile = action.payload;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.profileFetched = true;
        state.message = action.payload?.message || action.payload;
      })
      // Get all profiles cases
      .addCase(getAllProfiles.pending, (state, action) => {
        if (!action.meta.arg?.append) {
          state.isLoading = true;
        }
      })
      .addCase(getAllProfiles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const {
          profiles = [],
          page,
          limit,
          total,
          hasMore,
          append,
        } = action.payload;
        state.profilesPagination = {
          page: page ?? 1,
          limit: limit ?? 24,
          total: total ?? profiles.length,
          hasMore: !!hasMore,
        };
        state.allProfiles = append
          ? [...state.allProfiles, ...profiles]
          : [...profiles];
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
      })
      // Update banner picture cases
      .addCase(updateBannerPicture.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateBannerPicture.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        if (state.profile) {
          state.profile.bannerPicture = action.payload.bannerPicture;
        }
      })
      .addCase(updateBannerPicture.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message || "Failed to update banner";
      });
  },
});

export const { reset } = profileSlice.actions;
export default profileSlice.reducer;
