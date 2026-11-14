import { localizedPath } from '@site/core/i18n';
import { ArrowLeftIcon, HomeIcon } from 'lucide-react';
import Link from 'next/link';

import { getCartCopy } from '../../i18n/cart-copy';

import type { Locale } from '@site/core/i18n';

export function CheckoutHeading({ locale }: { locale: Locale }) {
  const copy = getCartCopy(locale);
  return (
    <header className="mb-7 min-w-0">
      <nav
        aria-label={copy.breadcrumbs}
        className="mb-5 flex min-w-0 items-center gap-2 text-xs text-muted-foreground"
      >
        <Link
          href={localizedPath(locale, '/')}
          aria-label={copy.home}
          className="focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          <HomeIcon aria-hidden className="size-4" strokeWidth={1.75} />
        </Link>
        <span aria-hidden>/</span>
        <span aria-current="page" className="min-w-0 [overflow-wrap:anywhere]">
          {copy.checkout}
        </span>
      </nav>
      <div className="flex min-w-0 flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{copy.checkout}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {copy.intro}
          </p>
        </div>
        <Link
          href={localizedPath(locale, '/catalog')}
          className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-brand-text underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          <ArrowLeftIcon aria-hidden className="size-4" strokeWidth={1.75} />
          {copy.continueShopping}
        </Link>
      </div>
    </header>
  );
}
