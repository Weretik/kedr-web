export type StaffRole = 'Admin' | 'Seo' | 'Manager';

export interface StaffAccount {
  id: string;
  email: string;
  fullName: string;
  role: StaffRole;
  isBlocked: boolean;
  avatarUrl: string | null;
}

export interface CreateStaffAccountInput {
  email: string;
  fullName: string;
  role: StaffRole;
  password: string;
}

export const staffRoles: readonly StaffRole[] = ['Manager', 'Seo', 'Admin'];

export const staffRoleLabels: Record<StaffRole, string> = {
  Admin: 'Адміністратор',
  Seo: 'SEO-спеціаліст',
  Manager: 'Менеджер',
};
