import { describe, expect, it } from 'vitest';

import { toShellUser } from './shell-user';

import type { SessionRole, SessionUser } from '@admin/core/auth';

const userWith = (roles: SessionRole[]): SessionUser => ({
  avatarUrl: null,
  email: 'staff@kedr.ua',
  fullName: 'Staff',
  id: '1',
  roles,
});

describe('toShellUser', () => {
  it('gives an SEO specialist their own cabinet and no «Система» items', () => {
    const shellUser = toShellUser(userWith(['Seo']));

    expect(shellUser).toMatchObject({
      cabinetTitle: 'Кабінет SEO-спеціаліста',
      canManageUsers: false,
      isAdmin: false,
      roleBadge: 'SEO',
      roleLabel: 'SEO-спеціаліст',
    });
  });

  it('keeps the admin and manager texts', () => {
    expect(toShellUser(userWith(['Admin'])).cabinetTitle).toBe('Кабінет адміністратора');
    expect(toShellUser(userWith(['Manager'])).roleBadge).toBe('Manager');
  });
});
