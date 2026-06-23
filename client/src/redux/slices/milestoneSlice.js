import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import milestoneService from '../../services/milestoneService';

export const fetchMilestones = createAsyncThunk(
  'milestones/fetchMilestones',
  async (contractId, { rejectWithValue }) => {
    try {
      const data = await milestoneService.getContractMilestones(contractId);
      return data.milestones;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch milestones');
    }
  }
);

export const addMilestone = createAsyncThunk(
  'milestones/addMilestone',
  async ({ contractId, milestoneData }, { rejectWithValue }) => {
    try {
      const data = await milestoneService.createMilestone(contractId, milestoneData);
      return data.milestone;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to add milestone');
    }
  }
);

export const submitMilestoneDeliverable = createAsyncThunk(
  'milestones/submitMilestone',
  async ({ milestoneId, submissionData }, { rejectWithValue }) => {
    try {
      const data = await milestoneService.submitMilestone(milestoneId, submissionData);
      return data.milestone;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to submit milestone');
    }
  }
);

export const approveMilestoneDeliverable = createAsyncThunk(
  'milestones/approveMilestone',
  async (milestoneId, { rejectWithValue }) => {
    try {
      const data = await milestoneService.approveMilestone(milestoneId);
      return data.milestone;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to approve milestone');
    }
  }
);

export const rejectMilestoneDeliverable = createAsyncThunk(
  'milestones/rejectMilestone',
  async ({ milestoneId, rejectData }, { rejectWithValue }) => {
    try {
      const data = await milestoneService.rejectMilestone(milestoneId, rejectData);
      return data.milestone;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to reject milestone');
    }
  }
);

export const payMilestoneDeliverable = createAsyncThunk(
  'milestones/payMilestone',
  async (milestoneId, { rejectWithValue }) => {
    try {
      const data = await milestoneService.payMilestone(milestoneId);
      return data.milestone;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to pay milestone');
    }
  }
);

const initialState = {
  milestones: [],
  loading: false,
  error: null,
};

const milestoneSlice = createSlice({
  name: 'milestones',
  initialState,
  reducers: {
    clearMilestones: (state) => {
      state.milestones = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Milestones
      .addCase(fetchMilestones.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMilestones.fulfilled, (state, action) => {
        state.loading = false;
        state.milestones = action.payload;
      })
      .addCase(fetchMilestones.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Milestone
      .addCase(addMilestone.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMilestone.fulfilled, (state, action) => {
        state.loading = false;
        state.milestones.push(action.payload);
      })
      .addCase(addMilestone.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Submit Milestone
      .addCase(submitMilestoneDeliverable.fulfilled, (state, action) => {
        const index = state.milestones.findIndex((m) => m._id === action.payload._id);
        if (index !== -1) {
          state.milestones[index] = action.payload;
        }
      })
      // Approve Milestone
      .addCase(approveMilestoneDeliverable.fulfilled, (state, action) => {
        const index = state.milestones.findIndex((m) => m._id === action.payload._id);
        if (index !== -1) {
          state.milestones[index] = action.payload;
        }
      })
      // Reject Milestone
      .addCase(rejectMilestoneDeliverable.fulfilled, (state, action) => {
        const index = state.milestones.findIndex((m) => m._id === action.payload._id);
        if (index !== -1) {
          state.milestones[index] = action.payload;
        }
      })
      // Pay Milestone
      .addCase(payMilestoneDeliverable.fulfilled, (state, action) => {
        const index = state.milestones.findIndex((m) => m._id === action.payload._id);
        if (index !== -1) {
          state.milestones[index] = action.payload;
        }
      });
  },
});

export const { clearMilestones } = milestoneSlice.actions;
export default milestoneSlice.reducer;
