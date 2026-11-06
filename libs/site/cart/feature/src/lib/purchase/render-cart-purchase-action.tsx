import { formatPrice } from '@site/core/i18n';

import { CartBulkAddController } from './cart-bulk-add-controller';
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

/** A variant row from the model page; the product domain builds it without importing the cart. */
export type CartBulkAddInput = CartPurchaseInput & {
  details: string;
  href: string;
  current: boolean;
};

/** Server adapter for the model's variants table (spec site/product/002 D-05); null without variants. */
export function renderCartBulkAddAction(locale: Locale, inputs: readonly CartBulkAddInput[]) {
  if (inputs.length < 2) return null;
  const rows = inputs.map(({ details, href, current, ...input }) => ({
    input,
    view: {
      id: input.productId,
      title: input.title,
      details,
      href,
      current,
      price:
        typeof input.unitPrice === 'number' && input.unitPrice > 0
          ? formatPrice(locale, input.unitPrice)
          : null,
      purchasable: isPurchasable(input),
    },
  }));
  return <CartBulkAddController locale={locale} rows={rows} />;
}
