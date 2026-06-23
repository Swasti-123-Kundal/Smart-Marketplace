import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import proposalService from '../../services/proposalService';

export const submitProposal = createAsyncThunk(
  'proposals/submit',
  async (proposalData, { rejectWithValue }) => {
    try {
      return await proposalService.submitProposal(proposalData);
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to submit proposal');
    }
  }
);

export const fetchProposalsForProject = createAsyncThunk(
  'proposals/fetchForProject',
  async (projectId, { rejectWithValue }) => {
    try {
      return await proposalService.getProposalsForProject(projectId);
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch proposals');
    }
  }
);

export const fetchMyProposals = createAsyncThunk(
  'proposals/fetchMy',
  async (_, { rejectWithValue }) => {
    try {
      return await proposalService.getMyProposals();
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch your proposals');
    }
  }
);

export const acceptProposal = createAsyncThunk(
  'proposals/accept',
  async (id, { rejectWithValue }) => {
    try {
      return await proposalService.acceptProposal(id);
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to accept proposal');
    }
  }
);

export const rejectProposal = createAsyncThunk(
  'proposals/reject',
  async (id, { rejectWithValue }) => {
    try {
      return await proposalService.rejectProposal(id);
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to reject proposal');
    }
  }
);

const initialState = {
  proposals: [],
  myProposals: [],
  loading: false,
  error: null,
};

const proposalSlice = createSlice({
  name: 'proposals',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Submit
      .addCase(submitProposal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitProposal.fulfilled, (state, action) => {
        state.loading = false;
        state.myProposals.unshift(action.payload.proposal);
      })
      .addCase(submitProposal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch for Project
      .addCase(fetchProposalsForProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProposalsForProject.fulfilled, (state, action) => {
        state.loading = false;
        state.proposals = action.payload.proposals;
      })
      .addCase(fetchProposalsForProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch My Proposals
      .addCase(fetchMyProposals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyProposals.fulfilled, (state, action) => {
        state.loading = false;
        state.myProposals = action.payload.proposals;
      })
      .addCase(fetchMyProposals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Accept
      .addCase(acceptProposal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(acceptProposal.fulfilled, (state, action) => {
        state.loading = false;
        // Update in list
        state.proposals = state.proposals.map((p) =>
          p._id === action.payload.proposal._id ? action.payload.proposal : p
        );
      })
      .addCase(acceptProposal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Reject
      .addCase(rejectProposal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rejectProposal.fulfilled, (state, action) => {
        state.loading = false;
        state.proposals = state.proposals.map((p) =>
          p._id === action.payload.proposal._id ? action.payload.proposal : p
        );
      })
      .addCase(rejectProposal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default proposalSlice.reducer;
