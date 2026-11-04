'use client';

import { CartDrawer } from '@site/cart/ui';

import { cartViewProps } from './cart-view-props';
import { useCart } from '../runtime/cart-provider';

import type { Locale } from '@site/core/i18n';

export function CartDrawerController({ locale }: { locale: Locale }) {
  const { store, snapshot } = useCart();
  return (
    <CartDrawer
      {...cartViewProps(locale, snapshot, store)}
      open={snapshot.drawerOpen}
      onOpenChange={(open) => {
        if (open) store?.openDrawer();
        else store?.closeDrawer();
      }}
      onReturnFocus={() => {
        store?.restoreDrawerFocus();
      }}
      onCheckout={() => {
        store?.closeDrawer();
      }}
    />
  );
}
