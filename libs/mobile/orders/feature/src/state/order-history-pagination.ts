import type { OrderSummary } from '@mobile/orders/model';

export function mergeOrderSummaries(
  current: readonly OrderSummary[],
  incoming: readonly OrderSummary[],
): OrderSummary[] {
  const byId = new Map(current.map((order) => [order.orderId, order]));
  for (const order of incoming) byId.set(order.orderId, order);
  return [...byId.values()];
}
