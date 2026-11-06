import { canManageUsers } from '@admin/core/auth';

import type { SessionUser } from '@admin/core/auth';
import type { AdminShellUser } from '@admin/core/shell';

type ShellRoleTexts = Pick<AdminShellUser, 'cabinetTitle' | 'roleBadge' | 'roleLabel'>;

const adminTexts: ShellRoleTexts = {
  cabinetTitle: 'Кабінет адміністратора',
  roleBadge: 'Admin',
  roleLabel: 'Адміністратор',
};
const seoTexts: ShellRoleTexts = {
  cabinetTitle: 'Кабінет SEO-спеціаліста',
  roleBadge: 'SEO',
  roleLabel: 'SEO-спеціаліст',
};
const managerTexts: ShellRoleTexts = {
  cabinetTitle: 'Кабінет менеджера',
  roleBadge: 'Manager',
  roleLabel: 'Менеджер',
};

export const toShellUser = (user: SessionUser): AdminShellUser => {
  const isAdmin = user.roles.includes('Admin');
  const texts = isAdmin ? adminTexts : user.roles.includes('Seo') ? seoTexts : managerTexts;
  return {
    ...texts,
    canManageUsers: canManageUsers(user),
    email: user.email,
    fullName: user.fullName,
    isAdmin,
    avatarUrl: user.avatarUrl,
  };
};
