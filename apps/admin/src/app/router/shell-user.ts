import { canManageUsers } from '@admin/core/auth';

import type { SessionUser } from '@admin/core/auth';
import type { AdminShellUser } from '@admin/core/shell';

const roleLabel = (user: SessionUser): string =>
  user.roles.includes('Admin') ? 'Адміністратор' : 'Менеджер';

export const toShellUser = (user: SessionUser): AdminShellUser => ({
  canManageUsers: canManageUsers(user),
  email: user.email,
  fullName: user.fullName,
  roleLabel: roleLabel(user),
  avatarUrl: user.avatarUrl,
});
