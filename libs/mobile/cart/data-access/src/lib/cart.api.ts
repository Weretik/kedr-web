import { baseApi } from '@mobile/shared/api-client';

import { parseCreatedOrder, toCreateOrderRequest, type CreatedAdminOrder } from './order-contract';

import type { CreateAdminOrderPayload } from '@mobile/cart/model';

export const cartApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createCartOrder: build.mutation<
      CreatedAdminOrder,
      { idempotencyKey: string; payload: CreateAdminOrderPayload }
    >({
      invalidatesTags: (result) => [
        { type: 'Orders', id: 'LIST' },
        ...(result ? [{ type: 'Orders' as const, id: result.orderId }] : []),
      ],
      query: ({ idempotencyKey, payload }) => ({
        data: toCreateOrderRequest(payload),
        headers: { 'Idempotency-Key': idempotencyKey },
        method: 'POST',
        url: '/api/admin/orders',
      }),
      transformResponse: parseCreatedOrder,
    }),
  }),
});

export const { useCreateCartOrderMutation } = cartApi;
