import { toOrderDetail, type OrderDetail } from '@mobile/orders/model';
import { apiClient } from '@mobile/shared/api-client';

export type OrderDetailFetcher = (orderId: number) => Promise<OrderDetail>;

/** Reads one order from the order workspace; throws when offline or not found. */
export const fetchOrderDetail: OrderDetailFetcher = async (orderId) => {
  const response = await apiClient.get<unknown>(`/api/admin/order-workspace/orders/${orderId}`);
  return toOrderDetail(response.data);
};
