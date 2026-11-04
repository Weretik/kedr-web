import { CartPurchaseController } from './cart-purchase-controller';
import { CartQuickAddController } from './cart-quick-add-controller';

import type { CartPurchaseInput } from '@site/cart/model';
import type { Locale } from '@site/core/i18n';

const isPurchasable = (input: CartPurchaseInput) =>
  input.available &&
  typeof input.unitPrice === 'number' &&
  Number.isFinite(input.unitPrice) &&
  input.unitPrice > 0;

/** Server adapter handed to ProductPage by the app; no product-domain import is needed. */
export function renderCartPurchaseAction(locale: Locale, input: CartPurchaseInput) {
  if (!isPurchasable(input)) return null;
  return <CartPurchaseController locale={locale} input={input} />;
}

/** Server adapter for catalog listings: one-tap add for each purchasable card or row. */
export function renderCartQuickAddAction(locale: Locale, input: CartPurchaseInput) {
  if (!isPurchasable(input)) return null;
  return <CartQuickAddController locale={locale} input={input} />;
}
