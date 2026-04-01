import { createSlice } from "@reduxjs/toolkit";
import {
  getPosts,
  getFeed,
  createPost,
  toggleLikePost,
  editPost,
  deletePost,
} from "../../action/postAction";

const initialState = {
  posts: [],
  feedPosts: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
  postsFetched: false,
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPosts.pending, (state) => {
        state.isLoading = true;
        state.message = "Fetching all user posts....";
      })
      .addCase(getPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.message = "Posts fetched successfully";
        state.posts = action.payload.posts || [];
      })
      .addCase(getFeed.pending, (state) => {
        state.isLoading = true;
        state.message = "Fetching feed....";
      })
      .addCase(getFeed.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.message = "Feed fetched successfully";
        state.feedPosts = action.payload.posts || [];
      })
      .addCase(getFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message || action.payload;
      })
      .addCase(getPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message || action.payload;
      })
      .addCase(createPost.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // Pushing the new post object to the top of the feed!
        state.posts.unshift(action.payload.post);
        state.feedPosts.unshift(action.payload.post);
        state.message = "Post created successfully";
      })
      .addCase(createPost.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message || action.payload;
      })
      .addCase(toggleLikePost.fulfilled, (state, action) => {
        // Sync localized user post cache
        const postIndex = state.posts.findIndex(
          (p) => p._id === action.payload.postId,
        );
        if (postIndex !== -1) {
          state.posts[postIndex].likeCount = action.payload.likeCount;
        }

        // Sync global dashboard feed cache
        const feedPostIndex = state.feedPosts.findIndex(
          (p) => p._id === action.payload.postId,
        );
        if (feedPostIndex !== -1) {
          state.feedPosts[feedPostIndex].likeCount = action.payload.likeCount;
        }
      })
      .addCase(toggleLikePost.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload?.message || "Failed to like post";
      })
      .addCase(editPost.fulfilled, (state, action) => {
        const postIndex = state.posts.findIndex(
          (p) => p._id === action.payload.postId,
        );
        if (postIndex !== -1 && action.payload.post) {
          state.posts[postIndex] = {
            ...state.posts[postIndex],
            ...action.payload.post,
          };
        }

        const feedPostIndex = state.feedPosts.findIndex(
          (p) => p._id === action.payload.postId,
        );
        if (feedPostIndex !== -1 && action.payload.post) {
          state.feedPosts[feedPostIndex] = {
            ...state.feedPosts[feedPostIndex],
            ...action.payload.post,
          };
        }
      })
      .addCase(editPost.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload?.message || "Failed to edit post";
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((p) => p._id !== action.payload.postId);
        state.feedPosts = state.feedPosts.filter(
          (p) => p._id !== action.payload.postId,
        );
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload?.message || "Failed to delete post";
      });
  },
});

export default postSlice.reducer;
