export type StaffRole = 'Admin' | 'Manager';

export interface StaffAccount {
  id: string;
  email: string;
  fullName: string;
  role: StaffRole;
  isBlocked: boolean;
}

export interface CreateStaffAccountInput {
  email: string;
  fullName: string;
  role: StaffRole;
  password: string;
}

export const staffRoles: readonly StaffRole[] = ['Manager', 'Admin'];

export const staffRoleLabels: Record<StaffRole, string> = {
  Admin: 'Адміністратор',
  Manager: 'Менеджер',
};
