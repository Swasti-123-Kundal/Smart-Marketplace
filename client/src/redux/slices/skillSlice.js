import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import skillService from '../../services/skillService';

export const fetchQuiz = createAsyncThunk(
  'skills/fetchQuiz',
  async (skill, { rejectWithValue }) => {
    try {
      return await skillService.getQuiz(skill);
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch quiz');
    }
  }
);

export const submitQuizAnswers = createAsyncThunk(
  'skills/submitQuiz',
  async ({ skill, answers }, { rejectWithValue }) => {
    try {
      return await skillService.submitAnswers(skill, answers);
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to submit quiz');
    }
  }
);

export const fetchVerifications = createAsyncThunk(
  'skills/fetchVerifications',
  async (_, { rejectWithValue }) => {
    try {
      return await skillService.getVerifications();
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch verified skills');
    }
  }
);

const initialState = {
  currentQuiz: null,
  verifications: [],
  loading: false,
  error: null,
};

const skillSlice = createSlice({
  name: 'skills',
  initialState,
  reducers: {
    clearQuiz: (state) => {
      state.currentQuiz = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Quiz
      .addCase(fetchQuiz.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuiz.fulfilled, (state, action) => {
        state.loading = false;
        state.currentQuiz = action.payload.questions;
      })
      .addCase(fetchQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Submit Answers
      .addCase(submitQuizAnswers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitQuizAnswers.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.verified) {
          state.verifications.push(action.payload.verification);
        }
      })
      .addCase(submitQuizAnswers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Verifications
      .addCase(fetchVerifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVerifications.fulfilled, (state, action) => {
        state.loading = false;
        state.verifications = action.payload.verifications;
      })
      .addCase(fetchVerifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearQuiz } = skillSlice.actions;
export default skillSlice.reducer;
