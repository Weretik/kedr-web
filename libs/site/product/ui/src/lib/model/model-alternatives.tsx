import { ArrowRightIcon } from 'lucide-react';
import Link from 'next/link';

import { getProductDictionary } from '../i18n/product-dictionary';

import type { Locale } from '@site/core/i18n';

/** Shown when the chosen variant is out of stock: up to three in-stock variants (R-02). */
export function ModelAlternatives({
  locale,
  items,
}: {
  locale: Locale;
  items: readonly { href: string; label: string }[];
}) {
  if (!items.length) return null;
  const dictionary = getProductDictionary(locale);
  return (
    <aside className="mt-4 rounded-xl border border-border p-4">
      <p className="text-sm font-medium">{dictionary.inStockAlternatives}</p>
      <ul className="mt-2 flex flex-wrap gap-2">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              scroll={false}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-lg bg-brand-soft px-3 text-sm font-medium text-brand-text hover:underline"
            >
              {item.label}
              <ArrowRightIcon aria-hidden className="size-4 shrink-0" strokeWidth={1.75} />
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
