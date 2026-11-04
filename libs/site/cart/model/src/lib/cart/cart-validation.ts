import { isCartQuantity } from './quantity';

import type { CartLine } from './cart-types';

export function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export function isPositivePrice(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0;
}

export function safeCartSlug(value: unknown): string {
  return typeof value === 'string' && /^[\p{L}\p{N}][\p{L}\p{N}._~-]*$/u.test(value) ? value : '';
}

export function safeCartImage(value: unknown): string | undefined {
  if (typeof value !== 'string' || !value || /[\u0000-\u0020\u007f\\]/.test(value))
    return undefined;
  if (value.startsWith('/')) return value.startsWith('//') ? undefined : value;
  try {
    const parsed = new URL(value);
    return (parsed.protocol === 'https:' || parsed.protocol === 'http:') &&
      !parsed.username &&
      !parsed.password
      ? value
      : undefined;
  } catch {
    return undefined;
  }
}

export function parseCartLine(value: unknown): CartLine | null {
  if (!isRecord(value) || !isRecord(value.snapshot)) return null;
  const snapshot = value.snapshot;
  if (
    !isNonEmptyString(value.variantId) ||
    !isCartQuantity(value.quantity) ||
    !isNonEmptyString(snapshot.title) ||
    !isPositivePrice(snapshot.unitPrice) ||
    snapshot.currency !== 'UAH'
  )
    return null;
  const imageUrl = safeCartImage(snapshot.imageUrl);
  return {
    variantId: value.variantId,
    quantity: value.quantity,
    snapshot: {
      title: snapshot.title,
      unitPrice: snapshot.unitPrice,
      currency: 'UAH',
      slug: safeCartSlug(snapshot.slug),
      ...(imageUrl ? { imageUrl } : {}),
    },
  };
}
