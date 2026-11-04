import { LoaderCircleIcon } from 'lucide-react';

import { getCartCopy } from '../i18n/cart-copy';

import type { Locale } from '@site/core/i18n';

export function CheckoutLoading({ locale }: { locale: Locale }) {
  const copy = getCartCopy(locale);
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="min-w-0 rounded-xl border border-border p-5"
    >
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <LoaderCircleIcon
          aria-hidden
          className="size-4 shrink-0 motion-safe:animate-spin"
          strokeWidth={1.75}
        />
        {copy.cartLoading}
      </p>
      <div aria-hidden className="mt-5 grid gap-3 motion-safe:animate-pulse">
        <div className="h-16 rounded-lg bg-muted" />
        <div className="h-16 rounded-lg bg-muted" />
        <div className="h-10 w-2/3 rounded-lg bg-muted" />
      </div>
    </div>
  );
}
