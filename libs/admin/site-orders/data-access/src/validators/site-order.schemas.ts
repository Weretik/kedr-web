import { z } from 'zod';

/** Runtime shape of site order responses; mappers receive data that passed these schemas. */
const telegramStatus = z.enum(['sent', 'pending', 'failed']);
const instant = z.string().min(1);

const listItemSchema = z.object({
  orderId: z.string().uuid(),
  placedAtUtc: instant,
  firstName: z.string().max(30),
  phone: z.string().max(20),
  lineCount: z.number().int().nonnegative(),
  total: z.number().nonnegative(),
  telegramStatus,
  telegramLastError: z.string().nullable(),
});

export const siteOrderPageSchema = z.object({
  pagedInfo: z.object({
    pageNumber: z.number().int().min(1),
    pageSize: z.number().int().min(1).max(100),
    totalPages: z.number().int().nonnegative(),
    totalRecords: z.number().int().nonnegative(),
  }),
  value: z.array(listItemSchema).nullable(),
});

export const siteOrderDetailSchema = z.object({
  orderId: z.string().uuid(),
  placedAtUtc: instant,
  firstName: z.string().max(30),
  phone: z.string().max(20),
  total: z.number().nonnegative(),
  telegramStatus,
  telegramSentAtUtc: instant.nullable(),
  telegramLastAttemptAtUtc: instant.nullable(),
  telegramLastError: z.string().nullable(),
  comment: z.string().nullable().default(null),
  items: z.array(
    z.object({
      productId: z.string().max(64),
      title: z.string().max(500),
      unitPrice: z.number().nonnegative(),
      quantity: z.number().int().min(1),
      amount: z.number().nonnegative(),
    }),
  ),
});
