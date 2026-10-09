import { baseApi } from '@mobile/shared/api-client';
import { defaultSerializeQueryArgs } from '@reduxjs/toolkit/query';

import { buildOrderDetailRequest, buildOrderHistoryRequest } from './orders.requests';
import { parseOrderDetail } from '../mappers/order-detail.mapper';
import { parseOrderHistoryPage } from '../mappers/order-history.mapper';
import { mergeOrderHistoryPages } from '../pagination/order-history-pages';

import type { OrderHistoryQuery } from './orders.requests';
import type { OrderDetail, OrderPage } from '@mobile/orders/model';

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getOrderDetail: build.query<OrderDetail, number>({
      providesTags: (_result, _error, orderId) => [{ type: 'Orders', id: orderId }],
      query: buildOrderDetailRequest,
      transformResponse: parseOrderDetail,
    }),
    getOrderHistory: build.query<OrderPage, OrderHistoryQuery>({
      forceRefetch: ({ currentArg, previousArg }) => currentArg?.page !== previousArg?.page,
      merge: mergeOrderHistoryPages,
      providesTags: (result) => [
        { type: 'Orders', id: 'LIST' },
        ...(result?.items.map((order) => ({ type: 'Orders' as const, id: order.orderId })) ?? []),
      ],
      query: buildOrderHistoryRequest,
      serializeQueryArgs: ({ queryArgs, ...context }) =>
        defaultSerializeQueryArgs({
          ...context,
          queryArgs: { ...queryArgs, page: undefined },
        }),
      transformResponse: parseOrderHistoryPage,
    }),
  }),
});

export const { useGetOrderDetailQuery, useGetOrderHistoryQuery } = ordersApi;
