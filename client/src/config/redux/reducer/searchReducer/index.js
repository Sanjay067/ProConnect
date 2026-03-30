import { createSlice } from "@reduxjs/toolkit";
import { searchUsers } from "../../action/searchAction";

const initialState = {
  searchResults: [],
  isLoading: false,
  isError: false,
  message: "",
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    clearSearch: (state) => {
      state.searchResults = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action.payload;
        state.isError = false;
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.searchResults = [];
        state.message = action.payload?.message || "Search failed";
      });
  },
});

export const { clearSearch } = searchSlice.actions;
export default searchSlice.reducer;
