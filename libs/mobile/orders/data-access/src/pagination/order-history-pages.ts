import type { OrderPage } from '@mobile/orders/model';

export function mergeOrderHistoryPages(current: OrderPage, incoming: OrderPage): void {
  if (incoming.pageNumber === 1) {
    Object.assign(current, incoming);
    return;
  }

  const ordersById = new Map(current.items.map((order) => [order.orderId, order]));
  for (const order of incoming.items) ordersById.set(order.orderId, order);

  current.items = [...ordersById.values()];
  current.pageNumber = incoming.pageNumber;
  current.pageSize = incoming.pageSize;
  current.totalPages = incoming.totalPages;
  current.totalRecords = incoming.totalRecords;
}
