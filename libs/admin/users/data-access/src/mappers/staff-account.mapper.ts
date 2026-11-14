import { z } from 'zod';

import { staffAccountSchema, staffCandidateSchema } from '../validators/staff.schemas';

import type { StaffAccount, StaffCandidate } from '@admin/users/model';

export const mapStaffAccount = (data: unknown): StaffAccount => {
  const response = staffAccountSchema.parse(data);
  return {
    id: response.id,
    email: response.email,
    fullName: response.fullName,
    role: response.role,
    isBlocked: response.isBlocked,
    avatarUrl: response.avatarUrl ?? null,
  };
};

export const mapStaffAccounts = (data: unknown): StaffAccount[] =>
  z.array(z.unknown()).parse(data).map(mapStaffAccount);

export const mapStaffCandidates = (data: unknown): StaffCandidate[] =>
  z
    .array(staffCandidateSchema)
    .parse(data)
    .map((candidate) => ({
      id: candidate.id,
      email: candidate.email,
      fullName: candidate.fullName,
      isCustomer: candidate.isCustomer,
    }));
