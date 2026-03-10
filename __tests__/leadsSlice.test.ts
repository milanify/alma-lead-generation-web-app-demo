import leadsReducer, { fetchLeads, updateLeadStatus } from '@/lib/features/leadsSlice';
import { Lead } from '@/types';

describe('leadsSlice', () => {
  const initialState = {
    data: [
      { id: '1', firstName: 'John', status: 'PENDING' } as Lead
    ],
    status: 'idle' as const,
    error: null
  };

  it('should handle initial state', () => {
    expect(leadsReducer(undefined, { type: 'unknown' })).toEqual({
      data: [], status: 'idle', error: null
    });
  });

  it('should handle updateLeadStatus.fulfilled', () => {
    const action = {
      type: updateLeadStatus.fulfilled.type,
      payload: { id: '1', firstName: 'John', status: 'REACHED_OUT' }
    };
    
    const state = leadsReducer(initialState, action);
    expect(state.data[0].status).toEqual('REACHED_OUT');
  });
});