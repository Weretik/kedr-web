import { describe, expect, it } from 'vitest';

import { mapStaffProfile, toAvatarForm } from './staff-profile.mapper';

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

  it('sends the avatar in the file field', () => {
    const file = new Blob(['x'], { type: 'image/png' });
    expect(toAvatarForm(file).get('file')).toBeInstanceOf(Blob);
  });
});
