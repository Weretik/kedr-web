import { avatarSchema, staffProfileSchema } from '../validators/staff.schemas';

import type { StaffProfile } from '@admin/users/model';

export const mapStaffProfile = (data: unknown): StaffProfile => {
  const response = staffProfileSchema.parse(data);
  return {
    id: response.id,
    email: response.email,
    fullName: response.fullName,
    role: response.role,
    avatarUrl: response.avatarUrl ?? null,
  };
};

export const mapAvatarUrl = (data: unknown): string => avatarSchema.parse(data).avatarUrl;
