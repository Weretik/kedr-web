'use client';

import {
  DEFAULT_LISTING_QUERY,
  hasListingFilters,
  listingHref,
  parseListingQuery,
  serializeListingQuery,
  withoutFilters,
} from '@site/catalog/model';
import { Button, cn } from '@site/shared/ui';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

import { AttributeFilters } from './attribute-filters';
import { Flag, PriceInput } from './toolbar-controls';
import { getCatalogDictionary } from '../i18n/catalog-dictionary';

import type { ListingFilter, ListingQuery, SearchParamsRecord } from '@site/catalog/model';
import type { Locale } from '@site/core/i18n';
import type { FormEvent } from 'react';

type FilterFormProps = {
  locale: Locale;
  path: string;
  query: ListingQuery;
  extra: Record<string, string>;
  /** Attribute filters of a final category; empty elsewhere. */
  filters?: readonly ListingFilter[];
  /** Called after a choice that closes a surrounding panel. */
  onDone?: () => void;
};

const NO_FILTERS: readonly ListingFilter[] = [];

/** Form fields as URL params; repeated names (attribute values) stay lists. */
const formParams = (form: HTMLFormElement): SearchParamsRecord => {
  const params: Record<string, string[]> = {};
  for (const [name, value] of new FormData(form)) {
    if (typeof value === 'string') (params[name] ??= []).push(value);
  }
  return params;
};

/** Filters from the form on top of the current sort, view, and page size, from page 1. */
const nextQuery = (form: HTMLFormElement, query: ListingQuery): ListingQuery => {
  const chosen = parseListingQuery(formParams(form));
  return {
    ...query,
    attributes: chosen.attributes,
    inStock: chosen.inStock,
    isSale: chosen.isSale,
    isNew: chosen.isNew,
    priceFrom: chosen.priceFrom,
    priceTo: chosen.priceTo,
    page: 1,
  };
};

/**
 * Filters of a listing: the left column on desktop and the filter panel on phones. Stock, sale, and new flags, the
 * price range, and the attribute filters of a final category. A GET form that keeps the other choices in hidden fields, so it
 * also works without JavaScript; with JavaScript flags apply at once and the price on «Застосувати».
 */
export function FilterForm({
  locale,
  path,
  query,
  extra,
  filters = NO_FILTERS,
  onDone,
}: FilterFormProps) {
  // The dictionary holds functions, which cannot cross from a Server Component, so it is read here.
  const dictionary = getCatalogDictionary(locale);
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const kept = new URLSearchParams(
    serializeListingQuery(
      { ...DEFAULT_LISTING_QUERY, sort: query.sort, view: query.view, perPage: query.perPage },
      extra,
    ),
  );

  const go = (next: ListingQuery) =>
    startTransition(() => router.push(listingHref(path, next, extra), { scroll: false }));
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    go(nextQuery(event.currentTarget, query));
    onDone?.();
  };
  const onChange = (event: FormEvent<HTMLFormElement>) => {
    if ((event.target as HTMLInputElement).type === 'checkbox')
      go(nextQuery(event.currentTarget, query));
  };

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
      className={cn('grid gap-4 text-sm', pending && 'opacity-70')}
    >
      {[...kept].map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <fieldset className="grid gap-2.5">
        <legend className="mb-3 font-semibold">{dictionary.filters}</legend>
        <Flag name="inStock" label={dictionary.onlyInStock} checked={query.inStock} />
        <Flag name="isSale" label={dictionary.onlySale} checked={query.isSale} />
        <Flag name="isNew" label={dictionary.onlyNew} checked={query.isNew} />
      </fieldset>
      <AttributeFilters filters={filters} />
      <div className="border-t border-border pt-4">
        <fieldset className="grid gap-2">
          <legend className="mb-3 font-semibold">{dictionary.price}</legend>
          <div className="grid grid-cols-2 gap-2">
            <PriceInput name="priceFrom" label={dictionary.priceFrom} value={query.priceFrom} />
            <PriceInput name="priceTo" label={dictionary.priceTo} value={query.priceTo} />
            <Button type="submit" variant="outline" size="sm" className="col-span-2 h-8">
              {dictionary.apply}
            </Button>
          </div>
        </fieldset>
      </div>
      {hasListingFilters(query) && (
        <Link
          href={listingHref(path, withoutFilters(query), extra)}
          scroll={false}
          onClick={onDone}
          className="justify-self-start text-sm underline-offset-4 hover:underline"
        >
          {dictionary.resetFilters}
        </Link>
      )}
    </form>
  );
}
