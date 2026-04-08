import { createSlice } from "@reduxjs/toolkit";
import {
  getConversations,
  getMessagesByPeer,
  sendMessage,
} from "../../action/messageAction";

const initialState = {
  conversations: [],
  messagesByPeer: {},
  activePeer: null,
  conversationsLoading: false,
  messagesLoading: false,
  sending: false,
  error: null,
};

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    setActivePeer: (state, action) => {
      state.activePeer = action.payload || null;
    },
    clearMessages: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getConversations.pending, (state) => {
        state.conversationsLoading = true;
        state.error = null;
      })
      .addCase(getConversations.fulfilled, (state, action) => {
        state.conversationsLoading = false;
        state.conversations = action.payload?.conversations || [];
      })
      .addCase(getConversations.rejected, (state, action) => {
        state.conversationsLoading = false;
        state.error = action.payload?.message || "Failed to fetch conversations";
      })
      .addCase(getMessagesByPeer.pending, (state) => {
        state.messagesLoading = true;
        state.error = null;
      })
      .addCase(getMessagesByPeer.fulfilled, (state, action) => {
        state.messagesLoading = false;
        const peerId = String(action.payload.peerId);
        state.messagesByPeer[peerId] = action.payload.messages || [];
      })
      .addCase(getMessagesByPeer.rejected, (state, action) => {
        state.messagesLoading = false;
        state.error = action.payload?.message || "Failed to fetch messages";
      })
      .addCase(sendMessage.pending, (state) => {
        state.sending = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.sending = false;
        const peerId = String(action.payload.peerId);
        const message = action.payload.message;
        if (!state.messagesByPeer[peerId]) state.messagesByPeer[peerId] = [];
        state.messagesByPeer[peerId].push(message);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.sending = false;
        state.error = action.payload?.message || "Failed to send message";
      });
  },
});

export const { setActivePeer, clearMessages } = messageSlice.actions;
export default messageSlice.reducer;
