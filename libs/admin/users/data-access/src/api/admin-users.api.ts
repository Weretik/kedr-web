import { baseApi } from '@admin/shared/api-client';

import { mapStaffAccount, mapStaffAccounts } from '../mappers/staff-account.mapper';

import type { CreateStaffAccountBody } from '../contracts/staff-account.contract';
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
  }),
});

export const {
  useChangeStaffRoleMutation,
  useCreateStaffAccountMutation,
  useGetStaffAccountsQuery,
  useSetStaffBlockedMutation,
  useSetStaffPasswordMutation,
} = adminUsersApi;
