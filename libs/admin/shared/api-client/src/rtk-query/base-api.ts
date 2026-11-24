import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';

import type { ApiError } from '../contracts/api-client-contract';

/** Every endpoint calls the typed `apiClient` in its `queryFn` through `apiCall`; there is no untyped base query. */
export const baseApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: fakeBaseQuery<ApiError>(),
  endpoints: () => ({}),
  tagTypes: [
    'Products',
    'AdminOrders',
    'AdminOrderDrafts',
    'StaffAccounts',
    'StaffProfile',
    'Categories',
    'CatalogAttributes',
    'SiteModels',
    'AdminSiteOrders',
  ],
});
