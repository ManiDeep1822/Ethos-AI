import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api/axios';

const initialState = {
  sessions: [],
  currentAnalysis: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Analyze text
export const analyzeText = createAsyncThunk(
  'analyzer/analyze',
  async (text, thunkAPI) => {
    try {
      const response = await API.post('/analyzer/analyze', { text });
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

// Save session
export const saveSession = createAsyncThunk(
  'analyzer/save',
  async (sessionData, thunkAPI) => {
    try {
      const response = await API.post('/analyzer/save', sessionData);
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

// Get all sessions
export const getSessions = createAsyncThunk(
  'analyzer/getAll',
  async (_, thunkAPI) => {
    try {
      const response = await API.get('/analyzer/sessions');
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

export const analyzerSlice = createSlice({
  name: 'analyzer',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    clearCurrentAnalysis: (state) => {
      state.currentAnalysis = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(analyzeText.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(analyzeText.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentAnalysis = action.payload;
      })
      .addCase(analyzeText.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(saveSession.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(saveSession.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.sessions.unshift(action.payload);
      })
      .addCase(saveSession.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getSessions.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSessions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.sessions = action.payload;
      })
      .addCase(getSessions.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, clearCurrentAnalysis } = analyzerSlice.actions;
export default analyzerSlice.reducer;
