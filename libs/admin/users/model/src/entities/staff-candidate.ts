import type { StaffRole } from './staff-account';

/** An existing account without staff access (usually a customer) that can be given a staff role. */
export interface StaffCandidate {
  id: string;
  email: string;
  fullName: string;
  isCustomer: boolean;
}

export interface GrantStaffAccessInput {
  userId: string;
  fullName: string;
  role: StaffRole;
  password: string;
}

/** The server searches from this many characters. */
export const minCandidateSearchLength = 2;
