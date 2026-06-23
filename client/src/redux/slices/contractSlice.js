import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import contractService from '../../services/contractService';

export const fetchContracts = createAsyncThunk(
  'contracts/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await contractService.getContracts();
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch contracts');
    }
  }
);

export const fetchContractDetails = createAsyncThunk(
  'contracts/fetchDetails',
  async (id, { rejectWithValue }) => {
    try {
      return await contractService.getContractById(id);
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch contract details');
    }
  }
);

export const updateContractStatus = createAsyncThunk(
  'contracts/updateStatus',
  async ({ id, statusData }, { rejectWithValue }) => {
    try {
      return await contractService.updateContractStatus(id, statusData);
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to update contract status');
    }
  }
);

const initialState = {
  contracts: [],
  currentContract: null,
  loading: false,
  error: null,
};

const contractSlice = createSlice({
  name: 'contracts',
  initialState,
  reducers: {
    clearCurrentContract: (state) => {
      state.currentContract = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchContracts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContracts.fulfilled, (state, action) => {
        state.loading = false;
        state.contracts = action.payload.contracts;
      })
      .addCase(fetchContracts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Details
      .addCase(fetchContractDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContractDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentContract = action.payload.contract;
      })
      .addCase(fetchContractDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Status
      .addCase(updateContractStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateContractStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.currentContract = action.payload.contract;
        state.contracts = state.contracts.map((c) =>
          c._id === action.payload.contract._id ? action.payload.contract : c
        );
      })
      .addCase(updateContractStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentContract } = contractSlice.actions;
export default contractSlice.reducer;
