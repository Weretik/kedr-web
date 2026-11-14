import { listingHref } from '@site/catalog/model';
import { cn } from '@site/shared/ui';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import Link from 'next/link';

import { getCatalogDictionary } from '../../i18n/catalog-dictionary';

import type { ListingQuery } from '@site/catalog/model';
import type { Locale } from '@site/core/i18n';

type ListingPaginationProps = {
  locale: Locale;
  /** Localized listing path; page 1 has no `page` parameter. */
  path: string;
  query: ListingQuery;
  totalPages: number;
  extra?: Record<string, string>;
};

/** Page numbers around the current page, with the first and last always shown; `null` marks a gap. */
export function paginationItems(current: number, total: number): (number | null)[] {
  const pages = new Set(
    [1, total, current - 1, current, current + 1].filter((page) => page >= 1 && page <= total),
  );
  const sorted = [...pages].sort((a, b) => a - b);
  return sorted.flatMap((page, index) => {
    const previous = sorted[index - 1];
    return previous !== undefined && page - previous > 1 ? [null, page] : [page];
  });
}

/** Server links to every page, so crawlers and visitors without JavaScript reach all products. */
export function ListingPagination({
  locale,
  path,
  query,
  totalPages,
  extra,
}: ListingPaginationProps) {
  if (totalPages <= 1) return null;
  const dictionary = getCatalogDictionary(locale);
  const href = (page: number) => listingHref(path, { ...query, page }, extra);
  const current = Math.min(query.page, totalPages);
  const step = 'grid h-9 min-w-9 place-items-center rounded-md px-2 text-sm';

  return (
    <nav
      aria-label={dictionary.pagination}
      className="flex flex-wrap items-center justify-center gap-1"
    >
      {current > 1 && (
        <Link
          href={href(current - 1)}
          className={cn(step, 'hover:bg-muted')}
          aria-label={dictionary.previousPage}
        >
          <ChevronLeftIcon className="size-4" strokeWidth={1.75} />
        </Link>
      )}
      {paginationItems(current, totalPages).map((page, index) =>
        page === null ? (
          <span key={`gap-${index}`} aria-hidden className={cn(step, 'text-muted-foreground')}>
            …
          </span>
        ) : (
          <Link
            key={page}
            href={href(page)}
            aria-label={dictionary.pageNumber(page)}
            aria-current={page === current ? 'page' : undefined}
            className={cn(
              step,
              page === current ? 'bg-primary text-primary-foreground' : 'hover:bg-muted',
            )}
          >
            {page}
          </Link>
        ),
      )}
      {current < totalPages && (
        <Link
          href={href(current + 1)}
          className={cn(step, 'hover:bg-muted')}
          aria-label={dictionary.nextPage}
        >
          <ChevronRightIcon className="size-4" strokeWidth={1.75} />
        </Link>
      )}
    </nav>
  );
}
