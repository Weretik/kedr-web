import { baseApi } from '@admin/shared/api-client';

import { mapAvatarUrl, mapStaffProfile, toAvatarForm } from '../mappers/staff-profile.mapper';

import type {
  ChangeNameBody,
  ChangeOwnEmailBody,
  ChangeOwnPasswordBody,
} from '../contracts/staff-profile.contract';
import type { StaffProfile } from '@admin/users/model';

const root = '/api/profile';

/** The signed-in staff member's own profile. Changes also refresh the staff list. */
export const profileApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getMyProfile: build.query<StaffProfile, void>({
      query: () => ({ url: root, method: 'GET' }),
      transformResponse: mapStaffProfile,
      providesTags: ['StaffProfile'],
    }),
    changeMyName: build.mutation<void, string>({
      query: (fullName) => ({
        url: `${root}/name`,
        method: 'PUT',
        data: { fullName: fullName.trim() } satisfies ChangeNameBody,
      }),
      invalidatesTags: ['StaffProfile', 'StaffAccounts'],
    }),
    uploadMyAvatar: build.mutation<string, Blob>({
      query: (file) => ({ url: `${root}/avatar`, method: 'PUT', data: toAvatarForm(file) }),
      transformResponse: mapAvatarUrl,
      invalidatesTags: ['StaffProfile', 'StaffAccounts'],
    }),
    removeMyAvatar: build.mutation<void, void>({
      query: () => ({ url: `${root}/avatar`, method: 'DELETE' }),
      invalidatesTags: ['StaffProfile', 'StaffAccounts'],
    }),
    changeMyEmail: build.mutation<void, ChangeOwnEmailBody>({
      query: ({ email, currentPassword }) => ({
        url: `${root}/email`,
        method: 'PUT',
        data: { email: email.trim(), currentPassword } satisfies ChangeOwnEmailBody,
      }),
      invalidatesTags: ['StaffProfile', 'StaffAccounts'],
    }),
    changeMyPassword: build.mutation<void, ChangeOwnPasswordBody>({
      query: (body) => ({ url: `${root}/password`, method: 'PUT', data: body }),
    }),
  }),
});

export const {
  useChangeMyEmailMutation,
  useChangeMyNameMutation,
  useChangeMyPasswordMutation,
  useGetMyProfileQuery,
  useRemoveMyAvatarMutation,
  useUploadMyAvatarMutation,
} = profileApi;
