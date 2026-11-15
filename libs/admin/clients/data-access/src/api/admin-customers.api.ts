import { apiCall, apiClient, baseApi } from '@admin/shared/api-client';

import { mapCustomerDetail, mapCustomerPage } from '../mappers/customer.mapper';

import type { CustomerPageParams } from '../contracts/customer.contract';
import type { CustomerDetail, CustomerPage, CustomerPageQuery } from '@admin/clients/model';

export const customersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCustomersPage: build.query<CustomerPage, CustomerPageQuery>({
      queryFn: ({ page, pageSize, searchTerm, counterpartyId, name, phone, sort }, { signal }) =>
        apiCall(
          apiClient.GET('/api/admin/customers', {
            params: {
              query: {
                page,
                pageSize,
                ...(searchTerm && { searchTerm }),
                ...(counterpartyId && { counterpartyId }),
                ...(name && { name }),
                ...(phone && { phone }),
                ...(sort && { sort }),
              } satisfies CustomerPageParams,
            },
            signal,
          }),
          mapCustomerPage,
        ),
    }),
    getCustomerById: build.query<CustomerDetail, string>({
      queryFn: (counterpartyId, { signal }) =>
        apiCall(
          apiClient.GET('/api/admin/customers/{counterpartyId}', {
            params: { path: { counterpartyId } },
            signal,
          }),
          mapCustomerDetail,
        ),
    }),
  }),
});

export const { useGetCustomersPageQuery, useGetCustomerByIdQuery } = customersApi;
