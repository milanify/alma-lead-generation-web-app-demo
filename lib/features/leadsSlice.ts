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
      .addCase(fetchLeads.pending, (state) => {
        // only show loading on first fetch
        if (state.data.length === 0) {
          state.status = 'loading';
        }
      })
      .addCase(fetchLeads.fulfilled, (state, action) => {
        const newLeads = action.payload;

        // prevent unnecessary rerenders if nothing changed
        const hasChanged =
          state.data.length !== newLeads.length ||
          newLeads.some((lead, i) => {
            const existing = state.data[i];
            if (!existing) return true;

            return (
              existing.id !== lead.id ||
              existing.status !== lead.status ||
              existing.firstName !== lead.firstName ||
              existing.lastName !== lead.lastName ||
              existing.citizenship !== lead.citizenship ||
              existing.submittedAt !== lead.submittedAt
            );
          });

        if (hasChanged) {
          state.data = newLeads;
        }

        state.status = 'succeeded';
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