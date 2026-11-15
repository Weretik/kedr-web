import { apiCall, apiClient, baseApi } from '@admin/shared/api-client';

import {
  mapCompanyRequisites,
  mapCompanyRequisitesHistory,
  toSaveCompanyRequisitesBody,
} from '../mappers/company-requisites.mapper';

import type {
  CompanyRequisites,
  CompanyRequisitesChange,
  CompanyRequisitesDraft,
} from '@admin/company/model';

export const adminCompanyRequisitesApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['CompanyRequisites', 'CompanyRequisitesHistory'] })
  .injectEndpoints({
    endpoints: (build) => ({
      getCompanyRequisites: build.query<CompanyRequisites, void>({
        queryFn: (_arg, { signal }) =>
          apiCall(apiClient.GET('/api/admin/content/requisites', { signal }), mapCompanyRequisites),
        providesTags: ['CompanyRequisites'],
      }),
      getCompanyRequisitesHistory: build.query<CompanyRequisitesChange[], void>({
        queryFn: (_arg, { signal }) =>
          apiCall(
            apiClient.GET('/api/admin/content/requisites/history', { signal }),
            mapCompanyRequisitesHistory,
          ),
        providesTags: ['CompanyRequisitesHistory'],
      }),
      updateCompanyRequisites: build.mutation<CompanyRequisites, CompanyRequisitesDraft>({
        queryFn: (draft, { signal }) =>
          apiCall(
            apiClient.PUT('/api/admin/content/requisites', {
              body: toSaveCompanyRequisitesBody(draft),
              signal,
            }),
            mapCompanyRequisites,
          ),
        invalidatesTags: (_result, error) =>
          error ? [] : ['CompanyRequisites', 'CompanyRequisitesHistory'],
      }),
    }),
  });

export const {
  useGetCompanyRequisitesHistoryQuery,
  useGetCompanyRequisitesQuery,
  useUpdateCompanyRequisitesMutation,
} = adminCompanyRequisitesApi;
