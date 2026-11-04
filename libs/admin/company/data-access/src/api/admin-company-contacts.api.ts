import { baseApi } from '@admin/shared/api-client';

import { mapCompanyContacts, toSaveCompanyContactsBody } from '../mappers/company-contacts.mapper';

import type { CompanyContacts, CompanyContactsDraft } from '@admin/company/model';

const url = '/api/admin/content/contacts';

export const adminCompanyContactsApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['CompanyContacts'] })
  .injectEndpoints({
    endpoints: (build) => ({
      getCompanyContacts: build.query<CompanyContacts, void>({
        query: () => ({ url, method: 'GET' }),
        transformResponse: mapCompanyContacts,
        providesTags: ['CompanyContacts'],
      }),
      updateCompanyContacts: build.mutation<CompanyContacts, CompanyContactsDraft>({
        query: (draft) => ({ url, method: 'PUT', data: toSaveCompanyContactsBody(draft) }),
        transformResponse: mapCompanyContacts,
        invalidatesTags: (_result, error) => (error ? [] : ['CompanyContacts']),
      }),
    }),
  });

export const { useGetCompanyContactsQuery, useUpdateCompanyContactsMutation } =
  adminCompanyContactsApi;
