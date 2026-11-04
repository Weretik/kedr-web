import { CartProvider } from './cart-provider';
import { submitQuickOrder } from '../actions/submit-quick-order';
import { CartDrawerController } from '../cart/cart-drawer-controller';

import type { Locale } from '@site/core/i18n';
import type { ReactNode } from 'react';

/** One provider/action/drawer composition around server-rendered SiteShell children. */
export function CartRuntime({ locale, children }: { locale: Locale; children: ReactNode }) {
  return (
    <CartProvider submitOrderAction={submitQuickOrder}>
      {children}
      <CartDrawerController locale={locale} />
    </CartProvider>
  );
}
