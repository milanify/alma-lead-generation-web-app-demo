import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LeadForm from '../components/LeadForm';

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ success: true }),
  })
) as jest.Mock;

describe('LeadForm Component', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it('renders required form elements', () => {
    render(<LeadForm />);
    expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Last Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument();
  });

  it('shows required error messages when submitting blank form', async () => {
    render(<LeadForm />);
    const submitBtn = screen.getByRole('button', { name: /Submit/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('First name is required')).toBeInTheDocument();
      expect(screen.getByText('Last name is required')).toBeInTheDocument();
      expect(screen.getByText('Country of Citizenship is required')).toBeInTheDocument();
      expect(screen.getByText('Valid LinkedIn / Personal Website URL is required. Or click None.')).toBeInTheDocument();
      expect(screen.getByText('Please select at least one visa')).toBeInTheDocument();
      expect(screen.getByText('Resume / CV is required')).toBeInTheDocument();
    });
  });

  it('checks custom validity for First Name with numbers', async () => {
    render(<LeadForm />);
    const firstNameInput = screen.getByPlaceholderText('First Name');
    fireEvent.change(firstNameInput, { target: { value: 'Milan123' } });

    // In JSDOM, setCustomValidity sets the validationMessage property.
    expect((firstNameInput as HTMLInputElement).validationMessage).toBe('Please include letters only.');
  });

  it('disables linkedin input when clicking None', async () => {
    render(<LeadForm />);
    const linkedInInput = screen.getByPlaceholderText('LinkedIn / Personal Website URL');
    const noneBtn = screen.getByRole('button', { name: 'None' });

    expect(linkedInInput).not.toBeDisabled();
    fireEvent.click(noneBtn);
    expect(linkedInInput).toBeDisabled();
  });

  it('shows dynamic textarea validation based on length', async () => {
    render(<LeadForm />);
    const textarea = screen.getByPlaceholderText(/What is your current status/i);
    fireEvent.change(textarea, { target: { value: '123' } }); // 3 chars

    const submitBtn = screen.getByRole('button', { name: /Submit/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('Please enter 7 more characters for submission. You have entered 3 so far.')).toBeInTheDocument();
    });
  });
});
