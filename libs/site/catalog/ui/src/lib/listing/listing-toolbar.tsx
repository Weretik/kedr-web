'use client';

import {
  LISTING_SORTS,
  hasListingFilters,
  listingHref,
  parseListingQuery,
  serializeListingQuery,
  withoutFilters,
} from '@site/catalog/model';
import { Button, cn } from '@site/shared/ui';
import { LayoutGridIcon, ListIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

import { Flag, PriceInput, ViewLink } from './toolbar-controls';
import { getCatalogDictionary } from '../i18n/catalog-dictionary';

import type { ListingQuery, ListingView } from '@site/catalog/model';
import type { Locale } from '@site/core/i18n';
import type { FormEvent } from 'react';

type ListingToolbarProps = {
  locale: Locale;
  /** Localized path of the listing, for example `/uk/catalog/ruchky`. */
  path: string;
  query: ListingQuery;
  /** Entries that are not listing choices but belong to the URL, such as the search term `q`. */
  extra?: Record<string, string>;
};

const formQuery = (form: HTMLFormElement): ListingQuery => ({
  ...parseListingQuery(Object.fromEntries(new FormData(form)) as Record<string, string>),
  page: 1,
});

/**
 * Filters, price range, sort, and view. A plain GET form, so it works without JavaScript; with JavaScript
 * flags and sort apply at once, and every change goes through the listing model, so equal choices give one URL.
 */
export function ListingToolbar({ locale, path, query, extra = {} }: ListingToolbarProps) {
  const dictionary = getCatalogDictionary(locale);
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const go = (next: ListingQuery) =>
    startTransition(() => router.push(listingHref(path, next, extra), { scroll: false }));

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    go(formQuery(event.currentTarget));
  };
  const onChange = (event: FormEvent<HTMLFormElement>) => {
    const target = event.target as HTMLInputElement | HTMLSelectElement;
    if (target.type === 'checkbox' || target.tagName === 'SELECT')
      go(formQuery(event.currentTarget));
  };
  const viewHref = (view: ListingView) => listingHref(path, { ...query, view }, extra);

  return (
    <form
      // Remount on every navigation so the uncontrolled fields show the choices of the new URL.
      key={serializeListingQuery(query)}
      action={path}
      method="get"
      onSubmit={onSubmit}
      onChange={onChange}
      aria-label={dictionary.filters}
      aria-busy={pending}
      className={cn(
        'flex flex-wrap items-end gap-x-5 gap-y-3 rounded-xl border border-border p-3 text-sm',
        pending && 'opacity-70',
      )}
    >
      {Object.entries(extra).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      {query.view !== 'grid' && <input type="hidden" name="view" value={query.view} />}

      <fieldset className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <legend className="sr-only">{dictionary.filters}</legend>
        <Flag name="inStock" label={dictionary.onlyInStock} checked={query.inStock} />
        <Flag name="isSale" label={dictionary.onlySale} checked={query.isSale} />
        <Flag name="isNew" label={dictionary.onlyNew} checked={query.isNew} />
      </fieldset>

      <fieldset className="flex items-end gap-2">
        <legend className="mb-1 text-xs text-muted-foreground">{dictionary.price}</legend>
        <PriceInput name="priceFrom" label={dictionary.priceFrom} value={query.priceFrom} />
        <PriceInput name="priceTo" label={dictionary.priceTo} value={query.priceTo} />
        <Button type="submit" variant="outline" size="sm" className="h-9">
          {dictionary.apply}
        </Button>
      </fieldset>

      <label className="flex flex-col gap-1">
        <span className="text-xs text-muted-foreground">{dictionary.sort}</span>
        <select
          name="sort"
          defaultValue={query.sort}
          className="h-9 rounded-md border border-border bg-background px-2"
        >
          {LISTING_SORTS.map((sort) => (
            <option key={sort} value={sort}>
              {dictionary.sorts[sort]}
            </option>
          ))}
        </select>
      </label>

      <div className="ml-auto flex items-center gap-3">
        {hasListingFilters(query) && (
          <Link
            href={listingHref(path, withoutFilters(query), extra)}
            scroll={false}
            className="text-sm underline-offset-4 hover:underline"
          >
            {dictionary.resetFilters}
          </Link>
        )}
        <nav aria-label={dictionary.view} className="flex rounded-md border border-border p-0.5">
          <ViewLink
            href={viewHref('grid')}
            active={query.view === 'grid'}
            label={dictionary.viewGrid}
          >
            <LayoutGridIcon className="size-4" strokeWidth={1.75} />
          </ViewLink>
          <ViewLink
            href={viewHref('table')}
            active={query.view === 'table'}
            label={dictionary.viewTable}
          >
            <ListIcon className="size-4" strokeWidth={1.75} />
          </ViewLink>
        </nav>
      </div>
    </form>
  );
}
