import { Lead } from '@/types';

// Pre-populate with mock data
const initialLeads: Lead[] = [
  {
    id: '1', firstName: 'Jorge', lastName: 'Ruiz', email: 'jorge@example.com', citizenship: 'Mexico',
    linkedin: 'linkedin.com/in/jorge', visas: ['O-1'], resumeUrl: '', message: 'Help me', status: 'PENDING', submittedAt: '2024-02-02T14:45:00Z'
  },
  {
    id: '2', firstName: 'Bahar', lastName: 'Zamir', email: 'bahar@example.com', citizenship: 'Mexico',
    linkedin: 'linkedin.com/in/bahar', visas: ['EB-1A'], resumeUrl: '', message: 'Help me', status: 'PENDING', submittedAt: '2024-02-02T14:45:00Z'
  },
  {
    id: '3', firstName: 'Mary', lastName: 'Lopez', email: 'mary@example.com', citizenship: 'Brazil',
    linkedin: 'linkedin.com/in/mary', visas: ['O-1'], resumeUrl: '', message: 'Help me', status: 'PENDING', submittedAt: '2024-02-02T14:45:00Z'
  },
  {
    id: '4', firstName: 'Li', lastName: 'Zijin', email: 'li@example.com', citizenship: 'South Korea',
    linkedin: 'linkedin.com/in/li', visas: ['O-1'], resumeUrl: '', message: 'Help me', status: 'PENDING', submittedAt: '2024-02-02T14:45:00Z'
  },
  {
    id: '5', firstName: 'Mark', lastName: 'Antonov', email: 'mark@example.com', citizenship: 'Russia',
    linkedin: 'linkedin.com/in/mark', visas: ['EB-2 NIW'], resumeUrl: '', message: 'Help me', status: 'PENDING', submittedAt: '2024-02-02T14:45:00Z'
  },
  {
    id: '6', firstName: 'Jane', lastName: 'Ma', email: 'jane@example.com', citizenship: 'Mexico',
    linkedin: 'linkedin.com/in/jane', visas: ['O-1'], resumeUrl: '', message: 'Help me', status: 'PENDING', submittedAt: '2024-02-02T14:45:00Z'
  },
  {
    id: '7', firstName: 'Anand', lastName: 'Jain', email: 'anand@example.com', citizenship: 'Mexico',
    linkedin: 'linkedin.com/in/anand', visas: ['O-1'], resumeUrl: '', message: 'Help me', status: 'REACHED_OUT', submittedAt: '2024-02-02T14:45:00Z'
  },
  {
    id: '8', firstName: 'Anna', lastName: 'Voronova', email: 'anna@example.com', citizenship: 'France',
    linkedin: 'linkedin.com/in/anna', visas: ['O-1'], resumeUrl: '', message: 'Help me', status: 'PENDING', submittedAt: '2024-02-02T14:45:00Z'
  }
];

// In development, Next.js clears module state on hot reload. 
// Standard workaround is using globalThis to persist connection/mock caches.
const globalForMockDb = globalThis as unknown as {
  leadsDB: Lead[] | undefined;
};

export const leadsDB = globalForMockDb.leadsDB ?? initialLeads;

if (process.env.NODE_ENV !== 'production') globalForMockDb.leadsDB = leadsDB;