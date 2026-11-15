import { apiCall, apiClient, baseApi, formDataBody } from '@admin/shared/api-client';

import {
  mapStaffAccount,
  mapStaffAccounts,
  mapStaffCandidates,
} from '../mappers/staff-account.mapper';
import { mapAvatarUrl } from '../mappers/staff-profile.mapper';

import type {
  ChangeStaffEmailBody,
  CreateStaffAccountBody,
  GrantStaffAccessBody,
} from '../contracts/staff-account.contract';
import type { ChangeNameBody } from '../contracts/staff-profile.contract';
import type {
  CreateStaffAccountInput,
  GrantStaffAccessInput,
  StaffAccount,
  StaffCandidate,
  StaffRole,
} from '@admin/users/model';

export const adminUsersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getStaffAccounts: build.query<StaffAccount[], void>({
      queryFn: (_arg, { signal }) =>
        apiCall(apiClient.GET('/api/admin/users', { signal }), mapStaffAccounts),
      providesTags: ['StaffAccounts'],
    }),
    createStaffAccount: build.mutation<StaffAccount, CreateStaffAccountInput>({
      queryFn: (input, { signal }) =>
        apiCall(
          apiClient.POST('/api/admin/users', {
            body: {
              email: input.email.trim(),
              fullName: input.fullName.trim(),
              role: input.role,
              password: input.password,
            } satisfies CreateStaffAccountBody,
            signal,
          }),
          mapStaffAccount,
        ),
      invalidatesTags: ['StaffAccounts'],
    }),
    searchStaffCandidates: build.query<StaffCandidate[], string>({
      queryFn: (search, { signal }) =>
        apiCall(
          apiClient.GET('/api/admin/users/candidates', { params: { query: { search } }, signal }),
          mapStaffCandidates,
        ),
      providesTags: ['StaffAccounts'],
    }),
    grantStaffAccess: build.mutation<StaffAccount, GrantStaffAccessInput>({
      queryFn: ({ userId, ...input }, { signal }) =>
        apiCall(
          apiClient.POST('/api/admin/users/{userId}/staff-access', {
            params: { path: { userId } },
            body: {
              fullName: input.fullName.trim(),
              role: input.role,
              password: input.password,
            } satisfies GrantStaffAccessBody,
            signal,
          }),
          mapStaffAccount,
        ),
      invalidatesTags: ['StaffAccounts'],
    }),
    changeStaffRole: build.mutation<void, { userId: string; role: StaffRole }>({
      queryFn: ({ userId, role }, { signal }) =>
        apiCall(
          apiClient.PUT('/api/admin/users/{userId}/role', {
            params: { path: { userId } },
            body: { role },
            signal,
          }),
        ),
      invalidatesTags: ['StaffAccounts'],
    }),
    setStaffBlocked: build.mutation<void, { userId: string; blocked: boolean }>({
      queryFn: ({ userId, blocked }, { signal }) =>
        apiCall(
          apiClient.PUT('/api/admin/users/{userId}/blocked', {
            params: { path: { userId } },
            body: { blocked },
            signal,
          }),
        ),
      invalidatesTags: ['StaffAccounts'],
    }),
    setStaffPassword: build.mutation<void, { userId: string; password: string }>({
      queryFn: ({ userId, password }, { signal }) =>
        apiCall(
          apiClient.PUT('/api/admin/users/{userId}/password', {
            params: { path: { userId } },
            body: { password },
            signal,
          }),
        ),
    }),
    changeStaffName: build.mutation<void, { userId: string; fullName: string }>({
      queryFn: ({ userId, fullName }, { signal }) =>
        apiCall(
          apiClient.PUT('/api/admin/users/{userId}/name', {
            params: { path: { userId } },
            body: { fullName: fullName.trim() } satisfies ChangeNameBody,
            signal,
          }),
        ),
      invalidatesTags: ['StaffAccounts'],
    }),
    changeStaffEmail: build.mutation<void, { userId: string; email: string }>({
      queryFn: ({ userId, email }, { signal }) =>
        apiCall(
          apiClient.PUT('/api/admin/users/{userId}/email', {
            params: { path: { userId } },
            body: { email: email.trim() } satisfies ChangeStaffEmailBody,
            signal,
          }),
        ),
      invalidatesTags: ['StaffAccounts'],
    }),
    uploadStaffAvatar: build.mutation<string, { userId: string; file: Blob }>({
      queryFn: ({ userId, file }, { signal }) =>
        apiCall(
          apiClient.PUT('/api/admin/users/{userId}/avatar', {
            params: { path: { userId } },
            ...formDataBody({ file }),
            signal,
          }),
          mapAvatarUrl,
        ),
      invalidatesTags: ['StaffAccounts'],
    }),
    removeStaffAvatar: build.mutation<void, { userId: string }>({
      queryFn: ({ userId }, { signal }) =>
        apiCall(
          apiClient.DELETE('/api/admin/users/{userId}/avatar', {
            params: { path: { userId } },
            signal,
          }),
        ),
      invalidatesTags: ['StaffAccounts'],
    }),
  }),
});

export const {
  useChangeStaffEmailMutation,
  useChangeStaffNameMutation,
  useChangeStaffRoleMutation,
  useCreateStaffAccountMutation,
  useGetStaffAccountsQuery,
  useGrantStaffAccessMutation,
  useRemoveStaffAvatarMutation,
  useSearchStaffCandidatesQuery,
  useSetStaffBlockedMutation,
  useSetStaffPasswordMutation,
  useUploadStaffAvatarMutation,
} = adminUsersApi;
