import { canManageUsers } from '@admin/core/auth';

import type { SessionUser } from '@admin/core/auth';
import type { AdminShellUser } from '@admin/core/shell';

export const toShellUser = (user: SessionUser): AdminShellUser => {
  const isAdmin = user.roles.includes('Admin');
  return {
    canManageUsers: canManageUsers(user),
    email: user.email,
    fullName: user.fullName,
    roleLabel: isAdmin ? 'Адміністратор' : 'Менеджер',
    isAdmin,
    avatarUrl: user.avatarUrl,
  };
};
