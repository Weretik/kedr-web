import { ORDER_SYNC_STATUSES } from '@mobile/orders/model';
import { z } from 'zod';

export const orderDetailSchema = z.object({
  comment: z.string().max(1000).nullable(),
  counterparty: z.object({
    counterpartyId: z.string().max(64),
    name: z.string().max(300),
    phone: z.string().max(50).nullable(),
  }),
  createdAtUtc: z.string().datetime({ offset: true }),
  lines: z
    .array(
      z.object({
        amount: z.number().nonnegative(),
        productId: z.string().max(64),
        productName: z.string().max(512),
        quantity: z.number().int().min(1),
      }),
    )
    .min(1),
  orderId: z.number().int().min(1),
  orderNumber: z.string().max(32),
  sync: z.object({
    acceptedAtUtc: z.string().datetime({ offset: true }).nullable(),
    oneCDocumentNumber: z.string().max(128).nullable(),
    status: z.enum(ORDER_SYNC_STATUSES),
  }),
  totalAmount: z.number().nonnegative(),
});
