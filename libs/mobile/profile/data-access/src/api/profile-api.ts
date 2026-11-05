import { apiClient, toApiError } from '@mobile/shared/api-client';
import { z } from 'zod';

import type { ProfileFailure } from '@mobile/profile/model';

const root = '/api/profile';

/** A refused profile call, with what the cabinet needs to explain it. */
export class ProfileError extends Error {
  constructor(readonly failure: ProfileFailure) {
    super(failure.code);
  }
}

/** A photo picked on the device, ready to upload. */
export interface PickedPhoto {
  uri: string;
  mimeType: string;
  fileName: string;
}

/** The own-profile calls of KedrStore `/api/profile` (bearer requests need no CSRF header). */
export interface ProfileApi {
  changeName: (fullName: string) => Promise<void>;
  uploadAvatar: (photo: PickedPhoto) => Promise<string>;
  removeAvatar: () => Promise<void>;
  changeEmail: (email: string, currentPassword: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

const avatarSchema = z.object({ avatarUrl: z.string() });

async function call<T>(request: () => Promise<T>): Promise<T> {
  try {
    return await request();
  } catch (error) {
    const { code, fieldErrors, status } = toApiError(error);
    throw new ProfileError({ code, fieldErrors, status });
  }
}

export const profileApi: ProfileApi = {
  changeEmail: (email, currentPassword) =>
    call(async () => {
      await apiClient.put(`${root}/email`, { currentPassword, email: email.trim() });
    }),
  changeName: (fullName) =>
    call(async () => {
      await apiClient.put(`${root}/name`, { fullName: fullName.trim() });
    }),
  changePassword: (currentPassword, newPassword) =>
    call(async () => {
      await apiClient.put(`${root}/password`, { currentPassword, newPassword });
    }),
  removeAvatar: () =>
    call(async () => {
      await apiClient.delete(`${root}/avatar`);
    }),
  uploadAvatar: (photo) =>
    call(async () => {
      const form = new FormData();
      // React Native sends a file part from its uri.
      form.append('file', {
        name: photo.fileName,
        type: photo.mimeType,
        uri: photo.uri,
      } as unknown as Blob);
      const response = await apiClient.put<unknown>(`${root}/avatar`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return avatarSchema.parse(response.data).avatarUrl;
    }),
};
