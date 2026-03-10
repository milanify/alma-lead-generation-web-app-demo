export type LeadStatus = 'PENDING' | 'REACHED_OUT';

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  citizenship: string;
  linkedin: string;
  visas: string[];
  resumeUrl: string; // Base64 or mock URL
  message: string;
  status: LeadStatus;
  submittedAt: string; // ISO Date string
}

export interface AuthState {
  isAuthenticated: boolean;
  user: string | null;
}