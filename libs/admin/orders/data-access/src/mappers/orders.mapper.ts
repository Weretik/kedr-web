import {
  createdOrderSchema,
  customerPricesSchema,
  draftPageSchema,
  draftRecordSchema,
  orderConflictSchema,
  orderPageSchema,
  orderRecordSchema,
  quoteSchema,
} from '../validators/orders.schemas';

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

export function mapOrderPage(value: unknown): Page<OrderSummary> {
  const parsed = orderPageSchema.parse(value);
  const typed: BackendOrderPage = { pagedInfo: parsed.pagedInfo, value: parsed.value };
  return { items: typed.value, pageInfo: typed.pagedInfo };
}
export function mapDraftPage(value: unknown): Page<DraftSummary> {
  const parsed = draftPageSchema.parse(value);
  const typed: BackendDraftPage = { pagedInfo: parsed.pagedInfo, value: parsed.value };
  return { items: typed.value, pageInfo: typed.pagedInfo };
}
export const mapQuote = (value: unknown): OrderQuote => quoteSchema.parse(value);
export function mapOrderRecord(value: unknown): OrderRecord {
  const parsed = orderRecordSchema.parse(value);
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
  const parsed = draftRecordSchema.parse(value);
  return {
    ...parsed,
    note: parsed.note ?? null,
    pricingErrorCode: parsed.pricingErrorCode ?? null,
  };
}
export const mapCreatedOrder = (value: unknown) => createdOrderSchema.parse(value);
/** Customer unit prices by product ID; null when the product has no price for that customer. */
export function mapCustomerPrices(value: unknown): Record<string, number | null> {
  return Object.fromEntries(
    customerPricesSchema.parse(value).prices.map((price) => [price.productId, price.unitPrice]),
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
  const parsed = orderConflictSchema.safeParse(value);
  return parsed.success ? { code: parsed.data.code, quote: parsed.data.quote ?? null } : null;
}
