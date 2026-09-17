import { baseApi } from '@mobile/shared/api-client';

import { buildOrderDetailRequest, buildOrderHistoryRequest } from './orders.requests';
import { parseOrderDetail } from '../mappers/order-detail.mapper';
import { parseOrderHistoryPage } from '../mappers/order-history.mapper';

import type { OrderHistoryQuery } from './orders.requests';
import type { OrderDetail, OrderPage } from '@mobile/orders/model';

export * from './orders.requests';

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getOrderDetail: build.query<OrderDetail, number>({
      query: buildOrderDetailRequest,
      transformResponse: parseOrderDetail,
    }),
    getOrderHistory: build.query<OrderPage, OrderHistoryQuery>({
      query: buildOrderHistoryRequest,
      transformResponse: parseOrderHistoryPage,
    }),
  }),
});

export const { useGetOrderDetailQuery, useGetOrderHistoryQuery } = ordersApi;
