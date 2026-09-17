import { ORDER_SYNC_STATUSES } from '@mobile/orders/model';
import { z } from 'zod';

export const orderHistoryPageSchema = z.object({
  pagedInfo: z.object({
    pageNumber: z.number().int().min(1),
    pageSize: z.number().int().min(1).max(100),
    totalPages: z.number().int().nonnegative(),
    totalRecords: z.number().int().nonnegative(),
  }),
  value: z.array(
    z.object({
      counterpartyId: z.string().max(64),
      counterpartyName: z.string().max(300),
      createdAtUtc: z.string().datetime({ offset: true }),
      lineCount: z.number().int().min(1),
      oneCDocumentNumber: z.string().max(128).nullable(),
      orderId: z.number().int().min(1),
      orderNumber: z.string().max(32),
      syncStatus: z.enum(ORDER_SYNC_STATUSES),
      totalAmount: z.number().nonnegative(),
    }),
  ),
});
