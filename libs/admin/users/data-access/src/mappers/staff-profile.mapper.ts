import type { AvatarResponse, ProfileResponse } from '../contracts/staff-profile.contract';
import type { StaffProfile } from '@admin/users/model';

export const mapStaffProfile = (response: ProfileResponse): StaffProfile => ({
  id: response.id,
  email: response.email,
  fullName: response.fullName,
  role: response.role,
  avatarUrl: response.avatarUrl ?? null,
});

export const mapAvatarUrl = (response: AvatarResponse): string => response.avatarUrl;

/** Multipart body for an avatar upload; the server reads the `file` field. */
export const toAvatarForm = (file: Blob): FormData => {
  const form = new FormData();
  form.append('file', file);
  return form;
};
