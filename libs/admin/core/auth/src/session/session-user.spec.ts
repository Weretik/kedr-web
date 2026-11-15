import { describe, expect, it } from 'vitest';

import {
  canDeleteMedia,
  canEditCatalog,
  canManageBackgroundTasks,
  canManageRequisites,
  canManageUsers,
  isStaff,
  toSessionRoles,
} from './session-user';

import type { SessionRole, SessionUser } from './session-user';

const userWith = (roles: SessionRole[]): SessionUser => ({
  avatarUrl: null,
  email: 'staff@kedr.ua',
  fullName: 'Staff',
  id: '1',
  roles,
});

describe('session user rules', () => {
  it('lets an SEO specialist into the admin and edit the site catalog', () => {
    const seo = userWith(['Seo']);

    expect(isStaff(seo)).toBe(true);
    expect(canEditCatalog(seo)).toBe(true);
  });

  it('keeps users, requisites, and media deletion for administrators', () => {
    const seo = userWith(['Seo']);

    expect(canManageUsers(seo)).toBe(false);
    expect(canManageRequisites(seo)).toBe(false);
    expect(canManageBackgroundTasks(seo)).toBe(false);
    expect(canDeleteMedia(seo)).toBe(false);
  });

  it('keeps catalog structure closed to a manager', () => {
    expect(canEditCatalog(userWith(['Manager']))).toBe(false);
  });
});

describe('toSessionRoles', () => {
  it('keeps the roles this app knows and drops the rest', () => {
    expect(toSessionRoles(['Admin', 'Accountant', 'Seo'])).toEqual(['Admin', 'Seo']);
  });
});
