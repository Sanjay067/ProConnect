import { createSlice } from "@reduxjs/toolkit";
import { getPosts, createPost, toggleLikePost } from "../../action/postAction";

const initialState = {
  posts: [],
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
        state.message = "Post created successfully";
      })
      .addCase(createPost.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message || action.payload;
      })
      .addCase(toggleLikePost.fulfilled, (state, action) => {
        // Find the exact post in our Redux array that was just liked
        const postIndex = state.posts.findIndex(
          (p) => p._id === action.payload.postId,
        );

        if (postIndex !== -1) {
          // Update that specific post's likeCount with the fresh number from the backend
          state.posts[postIndex].likeCount = action.payload.likeCount;
        }
      })
      .addCase(toggleLikePost.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload?.message || "Failed to like post";
      });
  },
});

export default postSlice.reducer;
