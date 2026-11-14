import { localizedPath } from '@site/core/i18n';
import { Button } from '@site/shared/ui';
import { ArrowRightIcon, ShoppingCartIcon } from 'lucide-react';
import Link from 'next/link';

import { getCartCopy } from '../../i18n/cart-copy';

import type { Locale } from '@site/core/i18n';

export function CartEmpty({ locale, onContinue }: { locale: Locale; onContinue?: () => void }) {
  const copy = getCartCopy(locale);
  return (
    <section className="min-w-0 rounded-xl border border-border px-5 py-10 text-center">
      <div className="mx-auto mb-5 grid size-16 place-items-center rounded-full bg-brand-soft text-brand-text">
        <ShoppingCartIcon aria-hidden className="size-7" strokeWidth={1.75} />
      </div>
      <h2 className="text-2xl font-bold tracking-tight">{copy.emptyTitle}</h2>
      <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
        {copy.emptyText}
      </p>
      <Button asChild className="mt-6 h-auto min-h-12 max-w-full py-3 whitespace-normal">
        <Link href={localizedPath(locale, '/catalog')} onClick={onContinue}>
          {copy.toCatalog}
          <ArrowRightIcon aria-hidden strokeWidth={1.75} />
        </Link>
      </Button>
    </section>
  );
}
