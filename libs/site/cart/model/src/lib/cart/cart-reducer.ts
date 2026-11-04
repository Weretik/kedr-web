import { isPositivePrice, parseCartLine } from './cart-validation';
import { isCartQuantity, MAX_CART_QUANTITY } from './quantity';

import type { CartLine, CartMutationResult, CartPurchaseInput } from './cart-types';

export function addCartLine(
  lines: readonly CartLine[],
  input: CartPurchaseInput,
  quantity = 1,
): CartMutationResult {
  if (!input.available) return { ok: false, reason: 'unavailable' };
  if (!isPositivePrice(input.unitPrice)) return { ok: false, reason: 'invalid-price' };
  if (!isCartQuantity(quantity)) return { ok: false, reason: 'invalid-quantity' };
  const added = parseCartLine({
    variantId: input.productId,
    quantity,
    snapshot: input,
  });
  if (!added) return { ok: false, reason: 'invalid-product' };
  const existing = lines.find((line) => line.variantId === added.variantId);
  if (!existing) return { ok: true, lines: [...lines, added] };
  const nextQuantity = existing.quantity + quantity;
  if (nextQuantity > MAX_CART_QUANTITY) return { ok: false, reason: 'quantity-overflow' };
  return {
    ok: true,
    lines: lines.map((line) => (line === existing ? { ...line, quantity: nextQuantity } : line)),
  };
}

export function changeCartQuantity(
  lines: readonly CartLine[],
  productId: string,
  quantity: number,
): CartMutationResult {
  if (!isCartQuantity(quantity)) return { ok: false, reason: 'invalid-quantity' };
  if (!lines.some((line) => line.variantId === productId))
    return { ok: false, reason: 'not-found' };
  return {
    ok: true,
    lines: lines.map((line) => (line.variantId === productId ? { ...line, quantity } : line)),
  };
}

export function removeCartLine(lines: readonly CartLine[], productId: string): CartLine[] {
  return lines.filter((line) => line.variantId !== productId);
}
