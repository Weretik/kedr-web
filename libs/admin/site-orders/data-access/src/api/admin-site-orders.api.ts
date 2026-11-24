import { apiCall, apiClient, baseApi } from '@admin/shared/api-client';

import { mapSiteOrderDetail, mapSiteOrderPage } from '../mappers/site-order.mapper';

import type { SiteOrderPageParams } from '../contracts/site-order.contract';
import type { SiteOrderDetail, SiteOrderPage, SiteOrderPageQuery } from '@admin/site-orders/model';

/** «Замовлення з сайту»: orders buyers sent from the site, read-only, and a resend of a failed Telegram delivery. */
export const siteOrdersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getSiteOrdersPage: build.query<SiteOrderPage, SiteOrderPageQuery>({
      queryFn: ({ page, pageSize, search, problemOnly }, { signal }) =>
        apiCall(
          apiClient.GET('/api/admin/quick-orders', {
            params: {
              query: {
                page,
                pageSize,
                ...(search && { search }),
                ...(problemOnly && { delivery: 'problem' }),
              } satisfies SiteOrderPageParams,
            },
            signal,
          }),
          mapSiteOrderPage,
        ),
      providesTags: ['AdminSiteOrders'],
    }),
    getSiteOrderById: build.query<SiteOrderDetail, string>({
      queryFn: (orderId, { signal }) =>
        apiCall(
          apiClient.GET('/api/admin/quick-orders/{orderId}', {
            params: { path: { orderId } },
            signal,
          }),
          mapSiteOrderDetail,
        ),
      providesTags: ['AdminSiteOrders'],
    }),
    /** Only a failed order; the server checks the state, so a repeat answers 409 and sends nothing twice. */
    resendSiteOrderToTelegram: build.mutation<void, string>({
      queryFn: (orderId, { signal }) =>
        apiCall(
          apiClient.POST('/api/admin/quick-orders/{orderId}/telegram-resend', {
            params: { path: { orderId } },
            signal,
          }),
          () => undefined,
        ),
      invalidatesTags: ['AdminSiteOrders'],
    }),
  }),
});

export const {
  useGetSiteOrderByIdQuery,
  useGetSiteOrdersPageQuery,
  useResendSiteOrderToTelegramMutation,
} = siteOrdersApi;
