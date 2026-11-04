'use client';

import { getCartTotals } from '@site/cart/model';
import { CartHeaderButton } from '@site/cart/ui';

import { useCart } from '../runtime/cart-provider';

import type { Locale } from '@site/core/i18n';

export function CartHeaderAction({
  locale,
  compact = false,
}: {
  locale: Locale;
  compact?: boolean;
}) {
  const { store, snapshot } = useCart();
  return (
    <CartHeaderButton
      locale={locale}
      compact={compact}
      {...getCartTotals(snapshot.lines)}
      restoring={!snapshot.hydrated}
      open={snapshot.drawerOpen}
      onOpen={(opener) => {
        store?.openDrawer(opener);
      }}
    />
  );
}
