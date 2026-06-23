import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import chatService from '../../services/chatService';

export const fetchConversations = createAsyncThunk(
  'chat/fetchConversations',
  async (_, { rejectWithValue }) => {
    try {
      return await chatService.getConversations();
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch conversations');
    }
  }
);

export const fetchChatHistory = createAsyncThunk(
  'chat/fetchHistory',
  async (roomId, { rejectWithValue }) => {
    try {
      return await chatService.getHistory(roomId);
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch chat history');
    }
  }
);

const initialState = {
  conversations: [],
  messages: [],
  activeRoom: null,
  activePartner: null,
  onlineUsers: [],
  partnerTyping: false,
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setActiveRoom: (state, action) => {
      state.activeRoom = action.payload.roomId;
      state.activePartner = action.payload.partner;
    },
    receiveMessage: (state, action) => {
      // Append if it belongs to the current room
      if (state.activeRoom === action.payload.roomId) {
        state.messages.push(action.payload);
      }
      
      // Update conversations list latest message
      state.conversations = state.conversations.map((conv) => {
        const isMatch = 
          (conv.partner._id === action.payload.sender._id && conv.roomId === action.payload.roomId) ||
          (conv.partner._id === action.payload.recipient && conv.roomId === action.payload.roomId);
        
        if (isMatch) {
          return {
            ...conv,
            lastMessage: action.payload,
          };
        }
        return conv;
      });
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    setPartnerTyping: (state, action) => {
      if (state.activePartner && state.activePartner._id === action.payload.userId) {
        state.partnerTyping = action.payload.isTyping;
      }
    },
    clearChat: (state) => {
      state.messages = [];
      state.activeRoom = null;
      state.activePartner = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Conversations
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload.conversations;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch History
      .addCase(fetchChatHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChatHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload.messages;
      })
      .addCase(fetchChatHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setActiveRoom,
  receiveMessage,
  setOnlineUsers,
  setPartnerTyping,
  clearChat,
} = chatSlice.actions;

export default chatSlice.reducer;
