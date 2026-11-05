import { apiClient } from '@mobile/shared/api-client';
import { z } from 'zod';

import type { CalculationLine } from '@mobile/calculation/model';

const toUah = (kopecks: number) => kopecks / 100;
const toKopecks = (uah: number) => Math.round(uah * 100);

const apiLines = (lines: readonly CalculationLine[]) =>
  lines.map((line) => ({
    priceAdjustment: toUah(line.adjustmentKopecks),
    productId: line.productId.toString(),
    quantity: line.quantity,
  }));

const quoteSchema = z.object({
  lines: z.array(
    z.object({ baseUnitPrice: z.number(), productId: z.string(), unitPrice: z.number() }),
  ),
  quoteFingerprint: z.string(),
  totalAmount: z.number(),
});
const createdOrderSchema = z.object({ orderNumber: z.string() });
const draftSchema = z.object({
  counterpartyId: z.string(),
  draftId: z.number().int(),
  lines: z.array(
    z.object({ priceAdjustment: z.number(), productId: z.string(), quantity: z.number().int() }),
  ),
  note: z.string().nullable().optional(),
  title: z.string(),
  version: z.string(),
});

export interface ServerQuote {
  fingerprint: string;
  lines: { productId: number; baseUnitKopecks: number; unitKopecks: number }[];
  totalKopecks: number;
}

export interface ServerDraft {
  draftId: number;
  version: string;
  title: string;
  note: string | null;
  counterpartyId: string;
  lines: CalculationLine[];
}

export interface DraftInput {
  counterpartyId: string;
  title: string;
  note: string | null;
  lines: CalculationLine[];
}

/** The order workspace calls the calculation needs (KedrStore `sales/004`, `sales/005`, `sales/008`). */
export interface OrderWorkspaceApi {
  quote: (counterpartyId: string, lines: readonly CalculationLine[]) => Promise<ServerQuote>;
  createOrder: (
    input: {
      counterpartyId: string;
      lines: readonly CalculationLine[];
      comment: string | null;
      quoteFingerprint: string;
    },
    idempotencyKey: string,
  ) => Promise<{ orderNumber: string }>;
  createDraft: (
    input: DraftInput,
    idempotencyKey: string,
  ) => Promise<{ draftId: number; version: string }>;
  updateDraft: (
    draftId: number,
    version: string,
    input: DraftInput,
  ) => Promise<{ draftId: number; version: string }>;
  deleteDraft: (draftId: number, version: string) => Promise<void>;
  getDraft: (draftId: number) => Promise<ServerDraft>;
}

const draftBody = (input: DraftInput) => ({
  counterpartyId: input.counterpartyId,
  lines: apiLines(input.lines),
  note: input.note,
  title: input.title,
});

const fromDraft = (data: unknown): ServerDraft => {
  const draft = draftSchema.parse(data);
  return {
    counterpartyId: draft.counterpartyId,
    draftId: draft.draftId,
    lines: draft.lines.map((line) => ({
      adjustmentKopecks: toKopecks(line.priceAdjustment),
      productId: Number(line.productId),
      quantity: line.quantity,
    })),
    note: draft.note ?? null,
    title: draft.title,
    version: draft.version,
  };
};

export const orderWorkspaceApi: OrderWorkspaceApi = {
  async createDraft(input, idempotencyKey) {
    const response = await apiClient.post<unknown>(
      '/api/admin/order-workspace/drafts',
      draftBody(input),
      {
        headers: { 'Idempotency-Key': idempotencyKey },
      },
    );
    const draft = fromDraft(response.data);
    return { draftId: draft.draftId, version: draft.version };
  },
  async createOrder(input, idempotencyKey) {
    const response = await apiClient.post<unknown>(
      '/api/admin/order-workspace/orders',
      {
        comment: input.comment,
        counterpartyId: input.counterpartyId,
        lines: apiLines(input.lines),
        quoteFingerprint: input.quoteFingerprint,
      },
      { headers: { 'Idempotency-Key': idempotencyKey } },
    );
    return createdOrderSchema.parse(response.data);
  },
  async deleteDraft(draftId, version) {
    await apiClient.delete(`/api/admin/order-workspace/drafts/${draftId}`, {
      headers: { 'If-Match': version },
    });
  },
  async getDraft(draftId) {
    const response = await apiClient.get<unknown>(`/api/admin/order-workspace/drafts/${draftId}`);
    return fromDraft(response.data);
  },
  async quote(counterpartyId, lines) {
    const response = await apiClient.post<unknown>('/api/admin/order-workspace/quote', {
      counterpartyId,
      lines: apiLines(lines),
    });
    const quote = quoteSchema.parse(response.data);
    return {
      fingerprint: quote.quoteFingerprint,
      lines: quote.lines.map((line) => ({
        baseUnitKopecks: toKopecks(line.baseUnitPrice),
        productId: Number(line.productId),
        unitKopecks: toKopecks(line.unitPrice),
      })),
      totalKopecks: toKopecks(quote.totalAmount),
    };
  },
  async updateDraft(draftId, version, input) {
    const response = await apiClient.put<unknown>(
      `/api/admin/order-workspace/drafts/${draftId}`,
      draftBody(input),
      {
        headers: { 'If-Match': version },
      },
    );
    const draft = fromDraft(response.data);
    return { draftId: draft.draftId, version: draft.version };
  },
};
