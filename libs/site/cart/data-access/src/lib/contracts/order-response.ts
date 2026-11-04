import 'server-only';

import { z } from 'zod';

import type { QuickOrderResponseDto } from './order-contracts';
import type { CheckoutFieldErrors, CheckoutResult } from '@site/cart/model';
import type { SiteOrderApiResult } from '@site/shared/api-client';

const receiptSchema = z.object({ orderId: z.uuid() });

const uncertain = (): CheckoutResult => ({ kind: 'uncertain', messages: [] });

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/** Only bounded plain messages from the known validation/conflict shapes reach text nodes. */
const plainMessage = (value: unknown): string | null => {
  if (typeof value !== 'string') return null;
  const text = value.trim();
  if (
    text.length === 0 ||
    text.length > 500 ||
    /[<>\p{Cc}]/u.test(text) ||
    /\b(?:\w*exception|stack\s*trace|traceback)\b|\b(?:Error|TypeError|ReferenceError|SyntaxError):|^at\s+\S+/i.test(
      text,
    )
  )
    return null;
  return text;
};

const fieldKey = (value: unknown): 'firstName' | 'phone' | null => {
  if (typeof value !== 'string') return null;
  switch (value.toLowerCase()) {
    case 'firstname':
      return 'firstName';
    case 'phone':
      return 'phone';
    default:
      return null;
  }
};

const validationResult = (body: unknown): CheckoutResult => {
  const fieldErrors: CheckoutFieldErrors = {};
  const add = (field: unknown, message: unknown) => {
    const key = fieldKey(field);
    const safe = plainMessage(message);
    if (key === null || safe === null) return;
    const messages = fieldErrors[key] ?? [];
    if (messages.length < 5 && !messages.includes(safe)) fieldErrors[key] = [...messages, safe];
  };

  // These are existing consumer normalization shapes, not a new OpenAPI 400-body schema.
  if (isRecord(body) && isRecord(body.errors)) {
    for (const [field, messages] of Object.entries(body.errors)) {
      if (Array.isArray(messages)) for (const message of messages.slice(0, 5)) add(field, message);
    }
  } else if (Array.isArray(body)) {
    for (const item of body.slice(0, 20)) {
      if (isRecord(item))
        add(item.identifier ?? item.Identifier, item.errorMessage ?? item.ErrorMessage);
    }
  }

  return { kind: 'validation', fieldErrors, messages: [] };
};

export function parseQuickOrderResult(result: SiteOrderApiResult): CheckoutResult {
  if (result.kind === 'unavailable') return uncertain();

  if (result.status === 200) {
    const parsed = receiptSchema.safeParse(result.body);
    if (!parsed.success) return uncertain();
    const receipt: QuickOrderResponseDto = parsed.data;
    return { kind: 'created', orderId: receipt.orderId };
  }

  if (result.status === 400) return validationResult(result.body);

  if (result.status === 409) {
    if (!Array.isArray(result.body) || !result.body.every((item) => typeof item === 'string')) {
      return uncertain();
    }
    const messages = result.body
      .slice(0, 10)
      .map(plainMessage)
      .filter((item) => item !== null);
    return { kind: 'conflict', messages };
  }

  return uncertain();
}
