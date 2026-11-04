import { CheckoutHeading, CheckoutLoading } from '@site/cart/ui';
import { connection } from 'next/server';
import { Suspense } from 'react';

import { CheckoutController } from './checkout-controller';

import type { Locale } from '@site/core/i18n';

async function RequestCheckout({ locale }: { locale: Locale }) {
  await connection();
  return <CheckoutController locale={locale} />;
}

/** Private request-time leaf; only the neutral frame may be shared with the shell. */
export function CheckoutPage({ locale }: { locale: Locale }) {
  return (
    <section className="space-y-6">
      <CheckoutHeading locale={locale} />
      <Suspense fallback={<CheckoutLoading locale={locale} />}>
        <RequestCheckout locale={locale} />
      </Suspense>
    </section>
  );
}
