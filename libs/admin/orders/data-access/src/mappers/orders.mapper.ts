import { z } from 'zod';

import type {
  DraftRecord,
  DraftSummary,
  OrderInputLine,
  OrderQuote,
  OrderRecord,
  OrderSummary,
  Page,
} from '@admin/orders/model';
import type { operations } from '@shared/api-contracts';

type BackendOrderPage =
  operations['getAdminWorkspaceOrders']['responses'][200]['content']['application/json'];
type BackendDraftPage =
  operations['getAdminOrderDrafts']['responses'][200]['content']['application/json'];

const positive = z.number().int().positive();
const nonNegative = z.number().nonnegative();
const date = z.string().datetime({ offset: true });
const pageInfo = z.object({
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
const quote = z.object({
  counterpartyId: z.string().min(1),
  lines: quotedLine.array().min(1),
  totalAmount: nonNegative,
  quoteFingerprint: z.string().min(1),
});
const orderSummary = z.object({
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
const draftSummary = z.object({
  draftId: positive,
  title: z.string(),
  counterpartyId: z.string(),
  counterpartyName: z.string(),
  updatedAtUtc: date,
  lineCount: positive,
});
const orderRecord = orderSummary.omit({ lineCount: true, adjustmentAmount: true }).extend({
  comment: z.string().nullish(),
  lines: inputLine
    .extend({ productName: z.string(), amount: nonNegative, priceAdjustment: adjustment })
    .array(),
  oneCDocumentNumber: z.string().nullish(),
});
const draftRecord = z.object({
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
const customerPrices = z.object({
  counterpartyId: z.string(),
  prices: z.object({ productId: z.string(), unitPrice: nonNegative.nullable() }).array(),
});
const createdOrder = z.object({
  orderId: positive,
  orderNumber: z.string(),
  totalAmount: nonNegative,
  syncStatus: z.string(),
});

export function mapOrderPage(value: unknown): Page<OrderSummary> {
  const parsed = z.object({ pagedInfo: pageInfo, value: orderSummary.array() }).parse(value);
  const typed: BackendOrderPage = { pagedInfo: parsed.pagedInfo, value: parsed.value };
  return { items: typed.value, pageInfo: typed.pagedInfo };
}
export function mapDraftPage(value: unknown): Page<DraftSummary> {
  const parsed = z.object({ pagedInfo: pageInfo, value: draftSummary.array() }).parse(value);
  const typed: BackendDraftPage = { pagedInfo: parsed.pagedInfo, value: parsed.value };
  return { items: typed.value, pageInfo: typed.pagedInfo };
}
export const mapQuote = (value: unknown): OrderQuote => quote.parse(value);
export function mapOrderRecord(value: unknown): OrderRecord {
  const parsed = orderRecord.parse(value);
  return {
    ...parsed,
    lineCount: parsed.lines.length,
    adjustmentAmount:
      Math.round(
        parsed.lines.reduce((sum, line) => sum + line.priceAdjustment * line.quantity, 0) * 100,
      ) / 100,
    comment: parsed.comment ?? null,
    oneCDocumentNumber: parsed.oneCDocumentNumber ?? null,
  };
}
export function mapDraftRecord(value: unknown): DraftRecord {
  const parsed = draftRecord.parse(value);
  return {
    ...parsed,
    note: parsed.note ?? null,
    pricingErrorCode: parsed.pricingErrorCode ?? null,
  };
}
export const mapCreatedOrder = (value: unknown) => createdOrder.parse(value);
/** Customer unit prices by product ID; null when the product has no price for that customer. */
export function mapCustomerPrices(value: unknown): Record<string, number | null> {
  return Object.fromEntries(
    customerPrices.parse(value).prices.map((price) => [price.productId, price.unitPrice]),
  );
}
/** Request lines with the adjustment always present, as the server contract expects. */
export const toInputLines = (lines: OrderInputLine[]) =>
  lines.map(({ productId, quantity, priceAdjustment }) => ({
    productId,
    quantity,
    priceAdjustment: priceAdjustment ?? 0,
  }));
export function mapOrderConflict(
  value: unknown,
): { code: string; quote: OrderQuote | null } | null {
  const parsed = z.object({ code: z.string(), quote: quote.nullish() }).safeParse(value);
  return parsed.success ? { code: parsed.data.code, quote: parsed.data.quote ?? null } : null;
}
