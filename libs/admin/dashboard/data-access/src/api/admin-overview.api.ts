import { baseApi } from '@admin/shared/api-client';

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
      query: () => ({ url: '/api/admin/order-workspace/overview', method: 'GET' }),
      transformResponse: mapDashboardOrders,
    }),
    getDashboardCatalog: build.query<DashboardCatalog, void>({
      query: () => ({ url: '/api/admin/catalog/overview', method: 'GET' }),
      transformResponse: mapDashboardCatalog,
    }),
    getDashboardContent: build.query<DashboardContent, void>({
      query: () => ({ url: '/api/admin/content/overview', method: 'GET' }),
      transformResponse: mapDashboardContent,
    }),
  }),
});

export const {
  useGetDashboardOrdersQuery,
  useGetDashboardCatalogQuery,
  useGetDashboardContentQuery,
} = adminOverviewApi;
