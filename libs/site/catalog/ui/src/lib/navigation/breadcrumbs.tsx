import { ChevronRightIcon } from 'lucide-react';
import Link from 'next/link';

import { getCatalogDictionary } from '../i18n/catalog-dictionary';

import type { Locale } from '@site/core/i18n';

/** One breadcrumb; the last one is the current page and has no link. */
export type Crumb = { name: string; href: string };

/** Visible breadcrumb trail; its JSON-LD twin comes from `@site/catalog/seo` with the same items. */
export function Breadcrumbs({ locale, items }: { locale: Locale; items: readonly Crumb[] }) {
  const dictionary = getCatalogDictionary(locale);

  return (
    <nav aria-label={dictionary.breadcrumbs} className="text-sm text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={item.href} className="inline-flex items-center gap-1">
              {last ? (
                <span aria-current="page" className="text-foreground">
                  {item.name}
                </span>
              ) : (
                <>
                  <Link href={item.href} className="hover:text-foreground hover:underline">
                    {item.name}
                  </Link>
                  <ChevronRightIcon aria-hidden className="size-3.5" strokeWidth={1.75} />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
