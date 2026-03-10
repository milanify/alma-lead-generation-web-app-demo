import { Lead } from '../types';

// Pre-populate with mock data from the screenshot
export const leadsDB: Lead[] = [
  {
    id: '1', firstName: 'Jorge', lastName: 'Ruiz', email: 'jorge@example.com', citizenship: 'Mexico',
    linkedin: 'linkedin.com/in/jorge', visas: ['O-1'], resumeUrl: '', message: 'Help me', status: 'PENDING', submittedAt: '2024-02-02T14:45:00Z'
  },
  {
    id: '2', firstName: 'Bahar', lastName: 'Zamir', email: 'bahar@example.com', citizenship: 'Mexico',
    linkedin: 'linkedin.com/in/bahar', visas: ['EB-1A'], resumeUrl: '', message: 'Help me', status: 'PENDING', submittedAt: '2024-02-02T14:45:00Z'
  }
];