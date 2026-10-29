import { baseApi } from '@admin/shared/api-client';

import { mapStaffAccount, mapStaffAccounts } from '../mappers/staff-account.mapper';
import { mapAvatarUrl, toAvatarForm } from '../mappers/staff-profile.mapper';

import type {
  ChangeStaffEmailBody,
  CreateStaffAccountBody,
} from '../contracts/staff-account.contract';
import type { ChangeNameBody } from '../contracts/staff-profile.contract';
import type { CreateStaffAccountInput, StaffAccount, StaffRole } from '@admin/users/model';

const root = '/api/admin/users';
const userUrl = (userId: string, action: string) =>
  `${root}/${encodeURIComponent(userId)}/${action}`;

export const adminUsersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getStaffAccounts: build.query<StaffAccount[], void>({
      query: () => ({ url: root, method: 'GET' }),
      transformResponse: mapStaffAccounts,
      providesTags: ['StaffAccounts'],
    }),
    createStaffAccount: build.mutation<StaffAccount, CreateStaffAccountInput>({
      query: (input) => ({
        url: root,
        method: 'POST',
        data: {
          email: input.email.trim(),
          fullName: input.fullName.trim(),
          role: input.role,
          password: input.password,
        } satisfies CreateStaffAccountBody,
      }),
      transformResponse: mapStaffAccount,
      invalidatesTags: ['StaffAccounts'],
    }),
    changeStaffRole: build.mutation<void, { userId: string; role: StaffRole }>({
      query: ({ userId, role }) => ({
        url: userUrl(userId, 'role'),
        method: 'PUT',
        data: { role },
      }),
      invalidatesTags: ['StaffAccounts'],
    }),
    setStaffBlocked: build.mutation<void, { userId: string; blocked: boolean }>({
      query: ({ userId, blocked }) => ({
        url: userUrl(userId, 'blocked'),
        method: 'PUT',
        data: { blocked },
      }),
      invalidatesTags: ['StaffAccounts'],
    }),
    setStaffPassword: build.mutation<void, { userId: string; password: string }>({
      query: ({ userId, password }) => ({
        url: userUrl(userId, 'password'),
        method: 'PUT',
        data: { password },
      }),
    }),
    changeStaffName: build.mutation<void, { userId: string; fullName: string }>({
      query: ({ userId, fullName }) => ({
        url: userUrl(userId, 'name'),
        method: 'PUT',
        data: { fullName: fullName.trim() } satisfies ChangeNameBody,
      }),
      invalidatesTags: ['StaffAccounts'],
    }),
    changeStaffEmail: build.mutation<void, { userId: string; email: string }>({
      query: ({ userId, email }) => ({
        url: userUrl(userId, 'email'),
        method: 'PUT',
        data: { email: email.trim() } satisfies ChangeStaffEmailBody,
      }),
      invalidatesTags: ['StaffAccounts'],
    }),
    uploadStaffAvatar: build.mutation<string, { userId: string; file: Blob }>({
      query: ({ userId, file }) => ({
        url: userUrl(userId, 'avatar'),
        method: 'PUT',
        data: toAvatarForm(file),
      }),
      transformResponse: mapAvatarUrl,
      invalidatesTags: ['StaffAccounts'],
    }),
    removeStaffAvatar: build.mutation<void, { userId: string }>({
      query: ({ userId }) => ({ url: userUrl(userId, 'avatar'), method: 'DELETE' }),
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
  useRemoveStaffAvatarMutation,
  useSetStaffBlockedMutation,
  useSetStaffPasswordMutation,
  useUploadStaffAvatarMutation,
} = adminUsersApi;
