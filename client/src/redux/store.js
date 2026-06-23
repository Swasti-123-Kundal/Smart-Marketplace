import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import themeReducer from './slices/themeSlice';
import projectReducer from './slices/projectSlice';
import proposalReducer from './slices/proposalSlice';
import contractReducer from './slices/contractSlice';
import chatReducer from './slices/chatSlice';
import notificationReducer from './slices/notificationSlice';
import skillReducer from './slices/skillSlice';
import milestoneReducer from './slices/milestoneSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    projects: projectReducer,
    proposals: proposalReducer,
    contracts: contractReducer,
    chat: chatReducer,
    notifications: notificationReducer,
    skills: skillReducer,
    milestones: milestoneReducer,
  },
});

export default store;
