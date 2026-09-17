import { orderHistoryPageSchema } from '../contracts/order-history.schema';

import type { OrderPage } from '@mobile/orders/model';
import type { operations } from '@shared/api-contracts';

type OrderHistoryPageDto =
  operations['getAdminOrders']['responses'][200]['content']['application/json'];

export function parseOrderHistoryPage(response: unknown): OrderPage {
  const parsed = orderHistoryPageSchema.parse(response) satisfies OrderHistoryPageDto;

  return {
    items: parsed.value.map(
      ({
        counterpartyName,
        createdAtUtc,
        lineCount,
        orderId,
        orderNumber,
        syncStatus,
        totalAmount,
      }) => ({
        counterpartyName,
        createdAtUtc,
        lineCount,
        orderId,
        orderNumber,
        syncStatus,
        totalAmount,
      }),
    ),
    pageNumber: parsed.pagedInfo.pageNumber,
    pageSize: parsed.pagedInfo.pageSize,
    totalPages: parsed.pagedInfo.totalPages,
    totalRecords: parsed.pagedInfo.totalRecords,
  };
}
