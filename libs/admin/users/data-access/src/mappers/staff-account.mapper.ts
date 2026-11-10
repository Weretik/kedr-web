import type {
  StaffAccountResponse,
  StaffCandidateResponse,
} from '../contracts/staff-account.contract';
import type { StaffAccount, StaffCandidate } from '@admin/users/model';

export const mapStaffAccount = (response: StaffAccountResponse): StaffAccount => ({
  id: response.id,
  email: response.email,
  fullName: response.fullName,
  role: response.role,
  isBlocked: response.isBlocked,
  avatarUrl: response.avatarUrl ?? null,
});

export const mapStaffAccounts = (response: StaffAccountResponse[]): StaffAccount[] =>
  response.map(mapStaffAccount);

export const mapStaffCandidates = (response: StaffCandidateResponse[]): StaffCandidate[] =>
  response.map((candidate) => ({
    id: candidate.id,
    email: candidate.email,
    fullName: candidate.fullName,
    isCustomer: candidate.isCustomer,
  }));
