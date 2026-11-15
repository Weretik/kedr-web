import { apiCall, apiClient, baseApi } from '@admin/shared/api-client';

import {
  mapDashboardCatalog,
  mapDashboardContent,
  mapDashboardOrders,
} from '../mappers/overview.mapper';

import type { DashboardCatalog, DashboardContent, DashboardOrders } from '@admin/dashboard/model';

/** One read per module; each block of «Огляд» loads and fails on its own. */
export const adminOverviewApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getDashboardOrders: build.query<DashboardOrders, void>({
      queryFn: (_arg, { signal }) =>
        apiCall(
          apiClient.GET('/api/admin/order-workspace/overview', { signal }),
          mapDashboardOrders,
        ),
    }),
    getDashboardCatalog: build.query<DashboardCatalog, void>({
      queryFn: (_arg, { signal }) =>
        apiCall(apiClient.GET('/api/admin/catalog/overview', { signal }), mapDashboardCatalog),
    }),
    getDashboardContent: build.query<DashboardContent, void>({
      queryFn: (_arg, { signal }) =>
        apiCall(apiClient.GET('/api/admin/content/overview', { signal }), mapDashboardContent),
    }),
  }),
});

export const {
  useGetDashboardOrdersQuery,
  useGetDashboardCatalogQuery,
  useGetDashboardContentQuery,
} = adminOverviewApi;
