import { CartPurchaseController } from './cart-purchase-controller';

import type { CartPurchaseInput } from '@site/cart/model';
import type { Locale } from '@site/core/i18n';

/** Server adapter handed to ProductPage by the app; no product-domain import is needed. */
export function renderCartPurchaseAction(locale: Locale, input: CartPurchaseInput) {
  if (
    !input.available ||
    typeof input.unitPrice !== 'number' ||
    !Number.isFinite(input.unitPrice) ||
    input.unitPrice <= 0
  )
    return null;
  return <CartPurchaseController locale={locale} input={input} />;
}
