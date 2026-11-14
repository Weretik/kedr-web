import { describe, expect, it } from 'vitest';

import { mapStaffAccount, mapStaffCandidates } from './staff-account.mapper';

import type {
  StaffAccountResponse,
  StaffCandidateResponse,
} from '../contracts/staff-account.contract';

describe('staff account mapper', () => {
  it('maps an account and turns a missing avatar into null', () => {
    const response = {
      id: 'u-1',
      email: 'manager@kedr.ua',
      fullName: 'Менеджер',
      role: 'Manager',
      isBlocked: false,
    } as StaffAccountResponse;
    expect(mapStaffAccount(response)).toEqual({ ...response, avatarUrl: null });
  });

  it('keeps only the fields a candidate needs', () => {
    const candidate = {
      id: 'u-2',
      email: 'client@kedr.ua',
      fullName: 'Клієнт',
      isCustomer: true,
      extra: 'ignored',
    } as unknown as StaffCandidateResponse;
    expect(mapStaffCandidates([candidate])).toEqual([
      { id: 'u-2', email: 'client@kedr.ua', fullName: 'Клієнт', isCustomer: true },
    ]);
  });
});
