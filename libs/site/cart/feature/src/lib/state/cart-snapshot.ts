import type { CartLine, CheckoutDraft, CheckoutField, CheckoutResult } from '@site/cart/model';

export type SubmitOrderAction = (command: unknown) => Promise<CheckoutResult>;
export type CartReceipt = { orderId: string; unitCount: number; goodsSubtotal: number };
export type CartSnapshot = {
  hydrated: boolean;
  lines: CartLine[];
  draft: CheckoutDraft;
  touched: { firstName: boolean; phone: boolean };
  recoveryRequired: boolean;
  discardedCount: number | null;
  storageIssue: string | null;
  notice: string | null;
  drawerOpen: boolean;
  pending: boolean;
  result: CheckoutResult | null;
  receipt: CartReceipt | null;
};

export const SERVER_CART_SNAPSHOT: CartSnapshot = {
  hydrated: false,
  lines: [],
  draft: { firstName: '', phone: '' },
  touched: { firstName: false, phone: false },
  recoveryRequired: false,
  discardedCount: 0,
  storageIssue: null,
  notice: null,
  drawerOpen: false,
  pending: false,
  result: null,
  receipt: null,
};

/** A changed basket answers the «empty cart» complaint; the result goes away when nothing else is left in it. */
export function withoutEmptyCartMessage(result: CheckoutResult | null): CheckoutResult | null {
  if (result?.kind !== 'validation' || !result.messages.includes('empty-cart')) return result;
  const messages = result.messages.filter((message) => message !== 'empty-cart');
  return messages.length || Object.keys(result.fieldErrors).length ? { ...result, messages } : null;
}

/** Typing into a field clears that field's server error and keeps the others. */
export function withoutFieldError(
  result: CheckoutResult | null,
  field: CheckoutField,
): CheckoutResult | null {
  if (result?.kind !== 'validation' || !result.fieldErrors[field]) return result;
  const fieldErrors = { ...result.fieldErrors };
  delete fieldErrors[field];
  return { ...result, fieldErrors };
}

/**
 * The snapshot change when the server answers an order: a created order empties the basket and the form and keeps
 * a receipt; any other answer only shows the result.
 */
export function checkoutOutcome(
  result: CheckoutResult,
  accepted: Omit<CartReceipt, 'orderId'>,
  storageIssue: string | null,
): Partial<CartSnapshot> {
  if (result.kind !== 'created') return { pending: false, result };
  return {
    pending: false,
    result,
    receipt: { orderId: result.orderId, ...accepted },
    lines: [],
    draft: { firstName: '', phone: '' },
    touched: { firstName: false, phone: false },
    recoveryRequired: false,
    discardedCount: 0,
    notice: null,
    storageIssue,
  };
}
