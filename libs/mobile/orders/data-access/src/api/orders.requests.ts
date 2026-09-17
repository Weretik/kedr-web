import type { ApiRequest } from '@mobile/shared/api-client';

export const ORDER_HISTORY_PAGE_SIZE = 20;

export interface OrderHistoryQuery {
  counterpartyId?: string;
  page: number;
}

export function buildOrderHistoryRequest(query: OrderHistoryQuery): ApiRequest {
  const counterpartyId = query.counterpartyId?.trim();

  return {
    method: 'GET',
    params: {
      ...(counterpartyId ? { counterpartyId } : {}),
      page: query.page,
      pageSize: ORDER_HISTORY_PAGE_SIZE,
    },
    url: '/api/admin/orders',
  };
}

export function buildOrderDetailRequest(orderId: number): ApiRequest {
  return { method: 'GET', url: `/api/admin/orders/${orderId}` };
}
