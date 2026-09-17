import { orderDetailSchema } from '../contracts/order-detail.schema';

import type { OrderDetail } from '@mobile/orders/model';
import type { operations } from '@shared/api-contracts';

type OrderDetailDto =
  operations['getAdminOrderById']['responses'][200]['content']['application/json'];

export function parseOrderDetail(response: unknown): OrderDetail {
  const parsed = orderDetailSchema.parse(response) satisfies OrderDetailDto;

  return {
    acceptedAtUtc: parsed.sync.acceptedAtUtc,
    comment: parsed.comment,
    counterparty: parsed.counterparty,
    createdAtUtc: parsed.createdAtUtc,
    lines: parsed.lines,
    oneCDocumentNumber: parsed.sync.oneCDocumentNumber,
    orderId: parsed.orderId,
    orderNumber: parsed.orderNumber,
    syncStatus: parsed.sync.status,
    totalAmount: parsed.totalAmount,
  };
}
