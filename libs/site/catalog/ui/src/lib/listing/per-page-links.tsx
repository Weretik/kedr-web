import { LISTING_PAGE_SIZES, listingHref } from '@site/catalog/model';
import { cn } from '@site/shared/ui';
import Link from 'next/link';

import { getCatalogDictionary } from '../i18n/catalog-dictionary';

import type { ListingQuery } from '@site/catalog/model';
import type { Locale } from '@site/core/i18n';

type PerPageLinksProps = {
  locale: Locale;
  /** Localized path of the listing. */
  path: string;
  query: ListingQuery;
  extra?: Record<string, string>;
};

/**
 * «Показувати по 20 / 50 / 100». Links, so they work without JavaScript; a new size starts from page 1 and is
 * not indexed (`nofollow`; the listing marks such pages noindex).
 */
export function PerPageLinks({ locale, path, query, extra }: PerPageLinksProps) {
  const dictionary = getCatalogDictionary(locale);

  return (
    <nav aria-label={dictionary.perPage} className="flex items-center gap-2 text-sm">
      <span className="text-muted-foreground">{dictionary.perPage}</span>
      <ul className="flex rounded-md border border-border p-0.5">
        {LISTING_PAGE_SIZES.map((size) => {
          const active = size === query.perPage;
          return (
            <li key={size}>
              <Link
                href={listingHref(path, { ...query, perPage: size, page: 1 }, extra)}
                rel="nofollow"
                aria-label={dictionary.perPageOption(size)}
                aria-current={active ? 'true' : undefined}
                className={cn(
                  'grid h-8 min-w-10 place-items-center rounded px-2 tabular-nums',
                  active ? 'bg-muted font-semibold' : 'hover:bg-muted/60',
                )}
              >
                {size}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
