import type { StaffRole } from './staff-account';

/** The signed-in staff member's own profile. */
export interface StaffProfile {
  id: string;
  email: string;
  fullName: string;
  role: StaffRole;
  avatarUrl: string | null;
}

/** Only an administrator changes their own email and password; a manager changes name and photo. */
export const canChangeOwnCredentials = (profile: StaffProfile): boolean => profile.role === 'Admin';
