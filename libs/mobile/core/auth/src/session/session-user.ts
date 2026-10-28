export type SessionRole = 'Admin' | 'Manager' | 'User';

export interface SessionUser {
  id: string;
  email: string;
  fullName: string;
  roles: readonly SessionRole[];
}

/** The mobile app works with the admin API, so only staff can use it. */
export const isStaff = (user: SessionUser): boolean =>
  user.roles.includes('Admin') || user.roles.includes('Manager');
