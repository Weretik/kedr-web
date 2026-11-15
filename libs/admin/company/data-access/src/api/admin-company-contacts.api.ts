import { apiCall, apiClient, baseApi } from '@admin/shared/api-client';

import { mapCompanyContacts, toSaveCompanyContactsBody } from '../mappers/company-contacts.mapper';

import type { CompanyContacts, CompanyContactsDraft } from '@admin/company/model';

export const adminCompanyContactsApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['CompanyContacts'] })
  .injectEndpoints({
    endpoints: (build) => ({
      getCompanyContacts: build.query<CompanyContacts, void>({
        queryFn: (_arg, { signal }) =>
          apiCall(apiClient.GET('/api/admin/content/contacts', { signal }), mapCompanyContacts),
        providesTags: ['CompanyContacts'],
      }),
      updateCompanyContacts: build.mutation<CompanyContacts, CompanyContactsDraft>({
        queryFn: (draft, { signal }) =>
          apiCall(
            apiClient.PUT('/api/admin/content/contacts', {
              body: toSaveCompanyContactsBody(draft),
              signal,
            }),
            mapCompanyContacts,
          ),
        invalidatesTags: (_result, error) => (error ? [] : ['CompanyContacts']),
      }),
    }),
  });

export const { useGetCompanyContactsQuery, useUpdateCompanyContactsMutation } =
  adminCompanyContactsApi;
