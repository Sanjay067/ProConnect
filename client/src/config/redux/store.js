import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducer/authReducer";
import postReducer from "./reducer/postReducer";
import profileReducer from "./reducer/profileReducer";
import connectionReducer from "./reducer/connectionReducer";
import searchReducer from "./reducer/searchReducer";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    post: postReducer,
    profile: profileReducer,
    connection: connectionReducer,
    search: searchReducer,
  },
});
