import { apiCall, apiClient, baseApi } from '@admin/shared/api-client';

import type { operations } from '@shared/api-contracts';

type RetrySyncBody =
  operations['retryAdminOrderSync']['requestBody']['content']['application/json'];

interface RetrySyncArgs {
  orderId: number;
  reason: string;
}

/** The 1C delivery of one order: «Повторити» for an order 1C refused or never received. */
export const orderSyncApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /** Puts the order back in the queue; the next scheduler run sends it with the same number. */
    retryOrderSync: build.mutation<void, RetrySyncArgs>({
      queryFn: ({ orderId, reason }, { signal }) =>
        apiCall(
          apiClient.POST('/api/admin/orders/{orderId}/sync/retry', {
            params: { path: { orderId } },
            body: { reason } satisfies RetrySyncBody,
            signal,
          }),
          () => undefined,
        ),
      invalidatesTags: ['AdminOrders'],
    }),
  }),
});

export const { useRetryOrderSyncMutation } = orderSyncApi;
