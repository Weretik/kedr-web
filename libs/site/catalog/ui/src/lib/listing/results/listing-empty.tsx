import Link from 'next/link';

import { getCatalogDictionary } from '../../i18n/catalog-dictionary';

import type { Locale } from '@site/core/i18n';

type ListingEmptyProps = {
  locale: Locale;
  /** Why the list is empty: filters exclude everything, the page is past the end, or the API failed. */
  reason: 'filtered' | 'page' | 'unavailable' | 'none';
  /** Where to go instead: the list without filters or page 1. */
  resetHref?: string;
};

/** Empty or failed listing with the way back, instead of a blank area. */
export function ListingEmpty({ locale, reason, resetHref }: ListingEmptyProps) {
  const dictionary = getCatalogDictionary(locale);
  const title = reason === 'unavailable' ? dictionary.unavailable : dictionary.emptyTitle;
  const hints: Record<ListingEmptyProps['reason'], string | null> = {
    filtered: dictionary.emptyFiltered,
    page: dictionary.emptyPage,
    unavailable: null,
    none: null,
  };
  const hint = hints[reason];
  const action = reason === 'filtered' ? dictionary.resetFilters : dictionary.toFirstPage;
  const showAction = resetHref && (reason === 'filtered' || reason === 'page');

  return (
    <div
      role="status"
      className="rounded-xl border border-dashed border-border px-4 py-10 text-center"
    >
      <p className="font-medium">{title}</p>
      {hint && <p className="mt-1 text-sm text-muted-foreground">{hint}</p>}
      {showAction && (
        <Link
          href={resetHref}
          className="mt-4 inline-block text-sm font-medium underline-offset-4 hover:underline"
        >
          {action}
        </Link>
      )}
    </div>
  );
}
