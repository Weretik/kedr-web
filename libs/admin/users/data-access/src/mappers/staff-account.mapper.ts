import type { StaffAccountResponse } from '../contracts/staff-account.contract';
import type { StaffAccount } from '@admin/users/model';

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
