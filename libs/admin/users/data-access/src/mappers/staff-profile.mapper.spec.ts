import { describe, expect, it } from 'vitest';

import { mapStaffProfile } from './staff-profile.mapper';

import type { ProfileResponse } from '../contracts/staff-profile.contract';

describe('staff profile mapper', () => {
  it('maps the profile and turns a missing avatar into null', () => {
    const response = {
      id: 'u-1',
      email: 'admin@kedr.ua',
      fullName: 'Адмін',
      role: 'Admin',
    } as ProfileResponse;
    expect(mapStaffProfile(response)).toEqual({ ...response, avatarUrl: null });
  });
});
