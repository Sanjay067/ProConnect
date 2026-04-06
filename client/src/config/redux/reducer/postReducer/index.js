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
  feedPagination: {
    page: 1,
    limit: 20,
    total: 0,
    hasMore: false,
    truncated: false,
  },
  activeCommentPostId: null,
  messageSidebarOpen: false,
  messageRecipient: null,
  hiddenPostIds: [],
  isError: false,
  isSuccess: false,
  feedLoading: false,
  postsLoading: false,
  createPostLoading: false,
  message: "",
  postsFetched: false,
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    reset: () => initialState,
    toggleCommentSection: (state, action) => {
      const id = action.payload;
      state.activeCommentPostId =
        state.activeCommentPostId === id ? null : id;
    },
    updateCommentCount: (state, action) => {
      const { postId, count } = action.payload;
      const bump = (arr) => {
        const i = arr.findIndex((p) => String(p._id) === String(postId));
        if (i !== -1) {
          arr[i].commentCount = Math.max(
            0,
            (arr[i].commentCount || 0) + count,
          );
        }
      };
      bump(state.posts);
      bump(state.feedPosts);
    },
    hidePost: (state, action) => {
      const postId = String(action.payload);
      state.hiddenPostIds.push(postId);
      state.feedPosts = state.feedPosts.filter((p) => String(p._id) !== postId);
    },
    toggleMessageSidebar: (state) => {
      state.messageSidebarOpen = !state.messageSidebarOpen;
      if (!state.messageSidebarOpen) state.messageRecipient = null;
    },
    openMessageSidebar: (state, action) => {
      state.messageSidebarOpen = true;
      state.messageRecipient = action.payload || null;
    },
    closeMessageSidebar: (state) => {
      state.messageSidebarOpen = false;
      state.messageRecipient = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPosts.pending, (state) => {
        state.postsLoading = true;
        state.message = "Fetching all user posts....";
      })
      .addCase(getPosts.fulfilled, (state, action) => {
        state.postsLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.message = "Posts fetched successfully";
        state.posts = action.payload.posts || [];
      })
      .addCase(getFeed.pending, (state, action) => {
        if (!action.meta.arg?.append) {
          state.feedLoading = true;
        }
        state.message = "Fetching feed....";
      })
      .addCase(getFeed.fulfilled, (state, action) => {
        state.feedLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.message = "Feed fetched successfully";
        const {
          posts = [],
          page,
          limit,
          total,
          hasMore,
          truncated,
          append,
        } = action.payload;
        state.feedPagination = {
          page: page ?? 1,
          limit: limit ?? 20,
          total: total ?? posts.length,
          hasMore: !!hasMore,
          truncated: !!truncated,
        };
        state.feedPosts = append
          ? [...state.feedPosts, ...posts]
          : [...posts];
      })
      .addCase(getFeed.rejected, (state, action) => {
        state.feedLoading = false;
        state.isError = true;
        state.message = action.payload?.message || action.payload;
      })
      .addCase(getPosts.rejected, (state, action) => {
        state.postsLoading = false;
        state.isError = true;
        state.message = action.payload?.message || action.payload;
      })
      .addCase(createPost.pending, (state) => {
        state.createPostLoading = true;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.createPostLoading = false;
        state.isSuccess = true;
        state.posts.unshift(action.payload.post);
        state.feedPosts.unshift(action.payload.post);
        state.message = "Post created successfully";
      })
      .addCase(createPost.rejected, (state, action) => {
        state.createPostLoading = false;
        state.isError = true;
        state.message = action.payload?.message || action.payload;
      })
      .addCase(toggleLikePost.fulfilled, (state, action) => {
        const { postId, likeCount, liked } = action.payload;
        const sync = (arr) => {
          const i = arr.findIndex((p) => String(p._id) === String(postId));
          if (i !== -1) {
            arr[i].likeCount = likeCount;
            if (typeof liked === "boolean") arr[i].isLiked = liked;
          }
        };
        sync(state.posts);
        sync(state.feedPosts);
      })
      .addCase(toggleLikePost.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload?.message || "Failed to like post";
      })
      .addCase(editPost.fulfilled, (state, action) => {
        const pid = String(action.payload.postId);
        const postIndex = state.posts.findIndex((p) => String(p._id) === pid);
        if (postIndex !== -1 && action.payload.post) {
          state.posts[postIndex] = {
            ...state.posts[postIndex],
            ...action.payload.post,
          };
        }

        const feedPostIndex = state.feedPosts.findIndex(
          (p) => String(p._id) === pid,
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
        const pid = String(action.payload.postId);
        state.posts = state.posts.filter((p) => String(p._id) !== pid);
        state.feedPosts = state.feedPosts.filter((p) => String(p._id) !== pid);
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload?.message || "Failed to delete post";
      });
  },
});

export const {
  reset,
  toggleCommentSection,
  updateCommentCount,
  hidePost,
  toggleMessageSidebar,
  openMessageSidebar,
  closeMessageSidebar,
} = postSlice.actions;
export default postSlice.reducer;
