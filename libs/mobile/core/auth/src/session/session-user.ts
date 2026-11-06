/** `Seo` signs in to the admin only; the mobile app stays for Admin and Manager. */
export type SessionRole = 'Admin' | 'Seo' | 'Manager' | 'User';

export interface SessionUser {
  avatarUrl: string | null;
  id: string;
  email: string;
  fullName: string;
  roles: readonly SessionRole[];
}

/** The mobile app works with the admin API, so only staff can use it. */
export const isStaff = (user: SessionUser): boolean =>
  user.roles.includes('Admin') || user.roles.includes('Manager');

export const isAdmin = (user: SessionUser): boolean => user.roles.includes('Admin');
