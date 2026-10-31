import { z } from 'zod';

/** Runtime shape of order responses; mappers receive data that passed these schemas. */
const positive = z.number().int().positive();
const nonNegative = z.number().nonnegative();
const date = z.string().datetime({ offset: true });
export const pageInfoSchema = z.object({
  pageNumber: positive,
  pageSize: positive,
  totalPages: z.number().int().nonnegative(),
  totalRecords: z.number().int().nonnegative(),
});
const adjustment = z.number();
const inputLine = z.object({ productId: z.string().min(1), quantity: positive });
const pricedLine = inputLine.extend({
  productName: z.string().nullable(),
  unitPrice: nonNegative.nullable(),
  lineAmount: nonNegative.nullable(),
  priceAdjustment: adjustment,
  baseUnitPrice: nonNegative.nullable(),
});
const quotedLine = inputLine.extend({
  productName: z.string(),
  unitPrice: nonNegative,
  lineAmount: nonNegative,
  baseUnitPrice: nonNegative,
  priceAdjustment: adjustment,
});
export const quoteSchema = z.object({
  counterpartyId: z.string().min(1),
  lines: quotedLine.array().min(1),
  totalAmount: nonNegative,
  quoteFingerprint: z.string().min(1),
});
export const orderSummarySchema = z.object({
  orderId: positive,
  orderNumber: z.string(),
  counterpartyId: z.string(),
  counterpartyName: z.string(),
  createdAtUtc: date,
  lineCount: positive,
  totalAmount: nonNegative,
  syncStatus: z.string(),
  adjustmentAmount: adjustment,
});
export const draftSummarySchema = z.object({
  draftId: positive,
  title: z.string(),
  counterpartyId: z.string(),
  counterpartyName: z.string(),
  updatedAtUtc: date,
  lineCount: positive,
});
export const orderRecordSchema = orderSummarySchema
  .omit({ lineCount: true, adjustmentAmount: true })
  .extend({
    comment: z.string().nullish(),
    lines: inputLine
      .extend({ productName: z.string(), amount: nonNegative, priceAdjustment: adjustment })
      .array(),
    oneCDocumentNumber: z.string().nullish(),
  });
export const draftRecordSchema = z.object({
  draftId: positive,
  version: z.string().min(1),
  title: z.string().min(1),
  note: z.string().nullish(),
  counterpartyId: z.string(),
  counterpartyName: z.string(),
  createdAtUtc: date,
  updatedAtUtc: date,
  lines: pricedLine.array(),
  totalAmount: nonNegative.nullable(),
  pricingStatus: z.enum(['Available', 'Unavailable']),
  pricingErrorCode: z.string().nullish(),
});
export const customerPricesSchema = z.object({
  counterpartyId: z.string(),
  prices: z.object({ productId: z.string(), unitPrice: nonNegative.nullable() }).array(),
});
export const createdOrderSchema = z.object({
  orderId: positive,
  orderNumber: z.string(),
  totalAmount: nonNegative,
  syncStatus: z.string(),
});
export const orderPageSchema = z.object({
  pagedInfo: pageInfoSchema,
  value: orderSummarySchema.array(),
});
export const draftPageSchema = z.object({
  pagedInfo: pageInfoSchema,
  value: draftSummarySchema.array(),
});
export const orderConflictSchema = z.object({ code: z.string(), quote: quoteSchema.nullish() });
