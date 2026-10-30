import { maxPriceAdjustment } from '@admin/orders/model';

import type { OrderInputLine } from '@admin/orders/model';

/** localStorage key and format of the current order set; a stored value with another version is rejected. */
export const orderSetStorageKey = 'kedr-admin-current-order-set';
const version = 1;
export const maxOrderSetLines = 100;
const productIdPattern = /^[1-9]\d{0,9}$/;

export const isValidProductId = (productId: string) => productIdPattern.test(productId);

export function serializeOrderSet(lines: OrderInputLine[]): string {
  return JSON.stringify({ version, lines });
}

const isAdjustment = (value: unknown) =>
  typeof value === 'number' && Number.isFinite(value) && Math.abs(value) <= maxPriceAdjustment;

/** Throws when the stored value is not a valid order set. */
export function parseOrderSet(value: string | null): OrderInputLine[] {
  if (value === null) return [];
  const data: unknown = JSON.parse(value);
  if (
    typeof data !== 'object' ||
    data === null ||
    !('version' in data) ||
    data.version !== version ||
    !('lines' in data) ||
    !Array.isArray(data.lines) ||
    data.lines.length > maxOrderSetLines
  )
    throw new Error('Invalid saved order set');
  const seen = new Set<string>();
  return data.lines.map((line: unknown) => {
    if (
      typeof line !== 'object' ||
      line === null ||
      !('productId' in line) ||
      !('quantity' in line) ||
      typeof line.productId !== 'string' ||
      !isValidProductId(line.productId) ||
      typeof line.quantity !== 'number' ||
      !Number.isSafeInteger(line.quantity) ||
      line.quantity < 1 ||
      ('priceAdjustment' in line && !isAdjustment(line.priceAdjustment)) ||
      seen.has(line.productId)
    )
      throw new Error('Invalid saved order line');
    seen.add(line.productId);
    const priceAdjustment = 'priceAdjustment' in line ? Number(line.priceAdjustment) : 0;
    return priceAdjustment
      ? { productId: line.productId, quantity: line.quantity, priceAdjustment }
      : { productId: line.productId, quantity: line.quantity };
  });
}
