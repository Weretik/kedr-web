'use client';

import { CartQuickAddButton } from '@site/cart/ui';

import { useCart } from '../runtime/cart-provider';

import type { CartPurchaseInput } from '@site/cart/model';
import type { Locale } from '@site/core/i18n';

/** Adds one unit and opens the drawer, so the buyer sees the result and the way to checkout. */
export function CartQuickAddController({
  locale,
  input,
}: {
  locale: Locale;
  input: CartPurchaseInput;
}) {
  const { store, snapshot } = useCart();
  return (
    <CartQuickAddButton
      locale={locale}
      title={input.title}
      disabled={!snapshot.hydrated || snapshot.pending || snapshot.recoveryRequired}
      onAdd={(opener) => {
        if (store?.add(input, 1)) store.openDrawer(opener);
      }}
    />
  );
}
