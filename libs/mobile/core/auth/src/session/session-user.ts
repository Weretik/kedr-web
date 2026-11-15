/** `Seo` signs in to the admin only; the mobile app stays for Admin and Manager. */
const sessionRoles = ['Admin', 'Seo', 'Manager', 'User'] as const;

export type SessionRole = (typeof sessionRoles)[number];

/** The API sends role names as strings; a role this app does not know grants nothing. */
export const toSessionRoles = (roles: readonly string[]): SessionRole[] =>
  roles.filter((role): role is SessionRole => (sessionRoles as readonly string[]).includes(role));

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
