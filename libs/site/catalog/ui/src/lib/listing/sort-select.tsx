'use client';

import { LISTING_SORTS, listingHref } from '@site/catalog/model';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

import type { CatalogDictionary } from '../i18n/catalog-dictionary';
import type { ListingQuery, ListingSort } from '@site/catalog/model';

type SortSelectProps = {
  dictionary: CatalogDictionary;
  path: string;
  query: ListingQuery;
  extra: Record<string, string>;
};

/** Sort choice; a new sort starts from page 1 and keeps the other choices. */
export function SortSelect({ dictionary, path, query, extra }: SortSelectProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <label className="relative">
      <span className="sr-only">{dictionary.sort}</span>
      <select
        value={query.sort}
        aria-busy={pending}
        onChange={(event) => {
          const sort = event.target.value as ListingSort;
          startTransition(() =>
            router.push(listingHref(path, { ...query, sort, page: 1 }, extra), { scroll: false }),
          );
        }}
        className="h-9 rounded-md border border-border bg-background px-3 text-sm"
      >
        {LISTING_SORTS.map((sort) => (
          <option key={sort} value={sort}>
            {dictionary.sorts[sort]}
          </option>
        ))}
      </select>
    </label>
  );
}
