import { z } from 'zod';

/** `GET /api/admin/order-workspace/orders/{orderId}` as the server sends it (amounts in hryvnias). */
export const orderDetailSchema = z.object({
  comment: z.string().nullable().optional(),
  counterpartyName: z.string(),
  createdAtUtc: z.string(),
  lines: z.array(
    z.object({
      amount: z.number(),
      priceAdjustment: z.number(),
      productId: z.string(),
      productName: z.string(),
      quantity: z.number().int(),
    }),
  ),
  oneCDocumentNumber: z.string().nullable().optional(),
  orderId: z.number().int(),
  orderNumber: z.string(),
  syncStatus: z.string(),
  totalAmount: z.number(),
});

export interface OrderDetailLine {
  productId: string;
  productName: string;
  quantity: number;
  /** Per-unit discount (negative) or markup (positive) the order was sent with. */
  adjustmentKopecks: number;
  amountKopecks: number;
}

/** A created order with its lines and adjustments (R-013). */
export interface OrderDetail {
  orderId: number;
  orderNumber: string;
  customerName: string;
  createdAtUtc: string;
  comment: string | null;
  syncStatus: string;
  oneCDocumentNumber: string | null;
  lines: OrderDetailLine[];
  totalKopecks: number;
}

const toKopecks = (amount: number) => Math.round(amount * 100);

export function toOrderDetail(data: unknown): OrderDetail {
  const order = orderDetailSchema.parse(data);
  return {
    comment: order.comment ?? null,
    createdAtUtc: order.createdAtUtc,
    customerName: order.counterpartyName,
    lines: order.lines.map((line) => ({
      adjustmentKopecks: toKopecks(line.priceAdjustment),
      amountKopecks: toKopecks(line.amount),
      productId: line.productId,
      productName: line.productName,
      quantity: line.quantity,
    })),
    oneCDocumentNumber: order.oneCDocumentNumber ?? null,
    orderId: order.orderId,
    orderNumber: order.orderNumber,
    syncStatus: order.syncStatus,
    totalKopecks: toKopecks(order.totalAmount),
  };
}
