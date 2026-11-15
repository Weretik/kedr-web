import { apiCall, apiClient, baseApi, formDataBody } from '@admin/shared/api-client';

import { mapAvatarUrl, mapStaffProfile } from '../mappers/staff-profile.mapper';

import type {
  ChangeNameBody,
  ChangeOwnEmailBody,
  ChangeOwnPasswordBody,
} from '../contracts/staff-profile.contract';
import type { StaffProfile } from '@admin/users/model';

/** The signed-in staff member's own profile. Changes also refresh the staff list. */
export const profileApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getMyProfile: build.query<StaffProfile, void>({
      queryFn: (_arg, { signal }) =>
        apiCall(apiClient.GET('/api/profile', { signal }), mapStaffProfile),
      providesTags: ['StaffProfile'],
    }),
    changeMyName: build.mutation<void, string>({
      queryFn: (fullName, { signal }) =>
        apiCall(
          apiClient.PUT('/api/profile/name', {
            body: { fullName: fullName.trim() } satisfies ChangeNameBody,
            signal,
          }),
        ),
      invalidatesTags: ['StaffProfile', 'StaffAccounts'],
    }),
    uploadMyAvatar: build.mutation<string, Blob>({
      queryFn: (file, { signal }) =>
        apiCall(
          apiClient.PUT('/api/profile/avatar', { ...formDataBody({ file }), signal }),
          mapAvatarUrl,
        ),
      invalidatesTags: ['StaffProfile', 'StaffAccounts'],
    }),
    removeMyAvatar: build.mutation<void, void>({
      queryFn: (_arg, { signal }) => apiCall(apiClient.DELETE('/api/profile/avatar', { signal })),
      invalidatesTags: ['StaffProfile', 'StaffAccounts'],
    }),
    changeMyEmail: build.mutation<void, ChangeOwnEmailBody>({
      queryFn: ({ email, currentPassword }, { signal }) =>
        apiCall(
          apiClient.PUT('/api/profile/email', {
            body: { email: email.trim(), currentPassword } satisfies ChangeOwnEmailBody,
            signal,
          }),
        ),
      invalidatesTags: ['StaffProfile', 'StaffAccounts'],
    }),
    changeMyPassword: build.mutation<void, ChangeOwnPasswordBody>({
      queryFn: (body, { signal }) =>
        apiCall(apiClient.PUT('/api/profile/password', { body: body, signal })),
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
