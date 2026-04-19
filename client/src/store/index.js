import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import analyzerReducer from './analyzerSlice';
import chatReducer from './chatSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    analyzer: analyzerReducer,
    chat: chatReducer,
  },
});
