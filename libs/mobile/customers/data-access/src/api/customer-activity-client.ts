import {
  customerDraftPageSchema,
  customerOrderPageSchema,
  type CustomerDraft,
  type CustomerOrder,
} from '@mobile/customers/model';
import { apiClient } from '@mobile/shared/api-client';

/** The card shows the last 50 orders and drafts of the customer (design: `orders_cache`, `drafts_cache`). */
const pageSize = 50;

export type CustomerActivityFetcher = (
  counterpartyId: string,
) => Promise<{ orders: CustomerOrder[]; drafts: CustomerDraft[] }>;

/** Reads the customer's newest orders and drafts from the order workspace; throws when offline or rejected. */
export const fetchCustomerActivity: CustomerActivityFetcher = async (counterpartyId) => {
  const [orders, drafts] = await Promise.all([
    apiClient.get<unknown>('/api/admin/order-workspace/orders', {
      params: { counterpartyId, page: 1, pageSize, sort: '-createdAt' },
    }),
    apiClient.get<unknown>('/api/admin/order-workspace/drafts', {
      params: { counterpartyId, page: 1, pageSize, sort: '-updatedAt' },
    }),
  ]);

  return {
    drafts: customerDraftPageSchema.parse(drafts.data).value,
    orders: customerOrderPageSchema.parse(orders.data).value,
  };
};
