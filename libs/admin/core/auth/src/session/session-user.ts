export type SessionRole = 'Admin' | 'Seo' | 'Manager' | 'User';

export interface SessionUser {
  id: string;
  email: string;
  fullName: string;
  roles: readonly SessionRole[];
  avatarUrl: string | null;
}

/** Admin works only for staff; a customer account signed in here sees "no access". */
export const isStaff = (user: SessionUser): boolean =>
  user.roles.includes('Admin') || user.roles.includes('Seo') || user.roles.includes('Manager');

export const canManageUsers = (user: SessionUser): boolean => user.roles.includes('Admin');

/** Catalog addresses, category texts, attributes, and deleted rows: administrators and SEO specialists. */
export const canEditCatalog = (user: SessionUser): boolean =>
  user.roles.includes('Admin') || user.roles.includes('Seo');

/** Media files and folders are deleted from the CDN for good, so only administrators may. */
export const canDeleteMedia = (user: SessionUser): boolean => user.roles.includes('Admin');
/** Payment requisites are money: administrators only, as the backend policy RequireAdminRole. */
export const canManageRequisites = (user: SessionUser): boolean => user.roles.includes('Admin');
