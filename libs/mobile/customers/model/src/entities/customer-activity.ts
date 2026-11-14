import { z } from 'zod';

/** One order of the customer, from `GET /api/admin/order-workspace/orders?counterpartyId=`. */
export const customerOrderSchema = z.object({
  orderId: z.number().int(),
  orderNumber: z.string(),
  createdAtUtc: z.string(),
  lineCount: z.number().int(),
  totalAmount: z.number(),
  syncStatus: z.string(),
});

/** One draft of the customer, from `GET /api/admin/order-workspace/drafts?counterpartyId=`. */
export const customerDraftSchema = z.object({
  draftId: z.number().int(),
  title: z.string(),
  updatedAtUtc: z.string(),
  lineCount: z.number().int(),
});

export const customerOrderPageSchema = z.object({ value: z.array(customerOrderSchema) });
export const customerDraftPageSchema = z.object({ value: z.array(customerDraftSchema) });

export type CustomerOrder = z.infer<typeof customerOrderSchema>;
export type CustomerDraft = z.infer<typeof customerDraftSchema>;

/** The customer's recent orders and drafts and when the device took them (epoch ms). */
export interface CustomerActivity {
  orders: CustomerOrder[];
  drafts: CustomerDraft[];
  fetchedAt: number;
}
