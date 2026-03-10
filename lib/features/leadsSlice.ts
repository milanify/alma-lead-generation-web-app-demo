import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Lead, LeadStatus } from '@/types';

interface LeadsState {
  data: Lead[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: LeadsState = { data: [], status: 'idle', error: null };

export const fetchLeads = createAsyncThunk('leads/fetchLeads', async () => {
  const response = await fetch('/api/leads');
  return (await response.json()) as Lead[];
});

export const updateLeadStatus = createAsyncThunk(
  'leads/updateStatus',
  async ({ id, status }: { id: string; status: LeadStatus }) => {
    const response = await fetch(`/api/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return (await response.json()) as Lead;
  }
);

const leadsSlice = createSlice({
  name: 'leads',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeads.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchLeads.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(updateLeadStatus.fulfilled, (state, action) => {
        const index = state.data.findIndex(l => l.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
      });
  },
});

export default leadsSlice.reducer;