import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api/axios';

const initialState = {
  sessions: [],
  currentSession: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Start new chat session
export const startChat = createAsyncThunk(
  'chat/start',
  async (scenario, thunkAPI) => {
    try {
      const response = await API.post('/chat/start', { scenario });
      if (response.data.success) {
        return response.data.data;
      } else {
        return thunkAPI.rejectWithValue(response.data.message);
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Send message
export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (messageData, thunkAPI) => {
    try {
      const response = await API.post('/chat/message', messageData);
      if (response.data.success) {
        return response.data.data;
      } else {
        return thunkAPI.rejectWithValue(response.data.message);
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get chat sessions
export const getChatSessions = createAsyncThunk(
  'chat/getSessions',
  async (_, thunkAPI) => {
    try {
      const response = await API.get('/chat/sessions');
      if (response.data.success) {
        return response.data.data;
      } else {
        return thunkAPI.rejectWithValue(response.data.message);
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    clearCurrentSession: (state) => {
      state.currentSession = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(startChat.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(startChat.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentSession = action.payload;
      })
      .addCase(startChat.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(sendMessage.pending, (state, action) => {
        state.isLoading = true;
        
        // Optimistic UI: Push user message immediately
        if (state.currentSession) {
          const { content } = action.meta.arg;
          state.currentSession.messages.push({ role: 'user', content });
        }
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        
        // Append AI Model message only (User message already added in pending)
        if (state.currentSession) {
          const { reply, coaching } = action.payload;
          state.currentSession.messages.push({ role: 'model', content: reply, coaching });
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getChatSessions.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getChatSessions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.sessions = action.payload;
      })
      .addCase(getChatSessions.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, clearCurrentSession } = chatSlice.actions;
export default chatSlice.reducer;
