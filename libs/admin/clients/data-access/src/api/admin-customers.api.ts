import { baseApi } from '@admin/shared/api-client';

import { mapCustomerDetail, mapCustomerPage } from '../mappers/customer.mapper';

import type { CustomerPageParams } from '../contracts/customer.contract';
import type { CustomerDetail, CustomerPage, CustomerPageQuery } from '@admin/clients/model';

export const customersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCustomersPage: build.query<CustomerPage, CustomerPageQuery>({
      query: ({ page, pageSize, searchTerm, counterpartyId, name, phone, sort }) => ({
        url: '/api/admin/customers',
        method: 'GET',
        params: {
          page,
          pageSize,
          ...(searchTerm && { searchTerm }),
          ...(counterpartyId && { counterpartyId }),
          ...(name && { name }),
          ...(phone && { phone }),
          ...(sort && { sort }),
        } satisfies CustomerPageParams,
      }),
      transformResponse: mapCustomerPage,
    }),
    getCustomerById: build.query<CustomerDetail, string>({
      query: (counterpartyId) => ({
        url: `/api/admin/customers/${encodeURIComponent(counterpartyId)}`,
        method: 'GET',
      }),
      transformResponse: mapCustomerDetail,
    }),
  }),
});

export const { useGetCustomersPageQuery, useGetCustomerByIdQuery } = customersApi;
