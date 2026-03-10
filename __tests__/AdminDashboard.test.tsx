import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import AdminDashboard from '../app/admin/page';
import leadsReducer from '../lib/features/leadsSlice';

const mockLeads = [
  { id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', citizenship: 'US', linkedin: 'in/john', visas: ['O-1'], resumeUrl: '', message: 'Help', status: 'PENDING', submittedAt: '2024-03-01T10:00:00Z' },
  { id: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', citizenship: 'Canada', linkedin: 'in/jane', visas: ['H-1B'], resumeUrl: '', message: 'Help', status: 'REACHED_OUT', submittedAt: '2024-03-02T10:00:00Z' },
  { id: '3', firstName: 'Alice', lastName: 'Wonder', email: 'alice@example.com', citizenship: 'UK', linkedin: 'in/alice', visas: ['O-1'], resumeUrl: '', message: 'Help', status: 'PENDING', submittedAt: '2024-03-03T10:00:00Z' },
  { id: '4', firstName: 'Bob', lastName: 'Builder', email: 'bob@example.com', citizenship: 'Australia', linkedin: 'in/bob', visas: ['EB-1A'], resumeUrl: '', message: 'Help', status: 'PENDING', submittedAt: '2024-03-04T10:00:00Z' },
  { id: '5', firstName: 'Charlie', lastName: 'Chaplin', email: 'charlie@example.com', citizenship: 'UK', linkedin: 'in/charlie', visas: ['O-1'], resumeUrl: '', message: 'Help', status: 'REACHED_OUT', submittedAt: '2024-03-05T10:00:00Z' },
  { id: '6', firstName: 'David', lastName: 'Bowie', email: 'david@example.com', citizenship: 'UK', linkedin: 'in/david', visas: ['O-1'], resumeUrl: '', message: 'Help', status: 'PENDING', submittedAt: '2024-03-06T10:00:00Z' }
];

const renderWithProviders = (
  ui: React.ReactElement,
  {
    preloadedState = {
      leads: { data: mockLeads, status: 'succeeded' as 'idle'|'loading'|'succeeded'|'failed', error: null }
    },
    store = configureStore({ reducer: { leads: leadsReducer }, preloadedState }),
    ...renderOptions
  } = {}
) => {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
};

describe('AdminDashboard', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  
  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders leads correctly', () => {
    renderWithProviders(<AdminDashboard />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('filters by status', async () => {
    renderWithProviders(<AdminDashboard />);
    const statusBtn = screen.getByRole('button', { name: /Status/i });
    fireEvent.click(statusBtn);
    
    const pendingFilter = screen.getByText('Pending', { selector: 'button' });
    fireEvent.click(pendingFilter);
    
    await waitFor(() => {
      // Bob should be here (PENDING)
      expect(screen.getByText('Bob Builder')).toBeInTheDocument();
      // Jane should NOT be here (REACHED_OUT)
      expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
    });
  });

  it('searches globally', async () => {
    renderWithProviders(<AdminDashboard />);
    const searchInput = screen.getByPlaceholderText('Search');
    
    // Search by Country instead of name
    fireEvent.change(searchInput, { target: { value: 'Australia' } });
    
    await waitFor(() => {
      expect(screen.getByText('Bob Builder')).toBeInTheDocument();
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    });
  });

  it('sorts by names ascending/descending', async () => {
    renderWithProviders(<AdminDashboard />);
    
    const nameHeader = screen.getByText(/Name/i);
    // Initially sorted by submittedAt desc
    fireEvent.click(nameHeader); // Now sorted by Name ASC
    
    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      // row[1] = first data row (Alice Wonder)
      expect(rows[1]).toHaveTextContent('Alice Wonder');
    });

    fireEvent.click(nameHeader); // Now sorted by Name DESC
    
    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      // row[1] = first data row (John Doe or based on alpha 'John Doe')
      expect(rows[1]).toHaveTextContent('John Doe'); // wait no, John D, David B, Charlie C. John is J, David is D. So wait, John should be first.
    });
  });

  it('handles pagination properly', async () => {
    // We have 6 elements. Default pagination is 5.
    renderWithProviders(<AdminDashboard />);
    
    // Page 1
    // First element in `mockLeads` by default is sorted by submittedAt DESC, which is 'David Bowie'
    expect(screen.getByText('David Bowie')).toBeInTheDocument();
    
    // 'John Doe' is oldest, should be on page 2.
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();

    const nextPageBtn = screen.getByText('>');
    fireEvent.click(nextPageBtn);
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.queryByText('David Bowie')).not.toBeInTheDocument();
    });
  });
});
