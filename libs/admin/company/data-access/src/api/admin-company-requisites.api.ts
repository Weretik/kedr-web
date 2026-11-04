import { baseApi } from '@admin/shared/api-client';

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

const url = '/api/admin/content/requisites';

export const adminCompanyRequisitesApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['CompanyRequisites', 'CompanyRequisitesHistory'] })
  .injectEndpoints({
    endpoints: (build) => ({
      getCompanyRequisites: build.query<CompanyRequisites, void>({
        query: () => ({ url, method: 'GET' }),
        transformResponse: mapCompanyRequisites,
        providesTags: ['CompanyRequisites'],
      }),
      getCompanyRequisitesHistory: build.query<CompanyRequisitesChange[], void>({
        query: () => ({ url: `${url}/history`, method: 'GET' }),
        transformResponse: mapCompanyRequisitesHistory,
        providesTags: ['CompanyRequisitesHistory'],
      }),
      updateCompanyRequisites: build.mutation<CompanyRequisites, CompanyRequisitesDraft>({
        query: (draft) => ({ url, method: 'PUT', data: toSaveCompanyRequisitesBody(draft) }),
        transformResponse: mapCompanyRequisites,
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
