import { SEARCH_PATH } from '@site/catalog/model';
import { getCatalogDictionary } from '@site/catalog/ui';
import { localizedPath } from '@site/core/i18n';
import { Suspense } from 'react';

import { readSearchTerm } from './search-term';
import { ListingSkeleton } from '../listing/listing-skeleton';
import { ProductListing } from '../listing/product-listing';

import type { SearchParamsRecord } from '@site/catalog/model';
import type { Locale } from '@site/core/i18n';

type SearchPageProps = { locale: Locale; searchParams: Promise<SearchParamsRecord> };

/** Search by name or SKU (`?q=`): a static frame with the form, results streamed from the URL. */
export function SearchPage({ locale, searchParams }: SearchPageProps) {
  const dictionary = getCatalogDictionary(locale);

  return (
    <div className="grid gap-6">
      <h1 className="text-2xl font-semibold tracking-tight lg:text-3xl">
        {dictionary.searchHeading}
      </h1>
      <Suspense fallback={<ListingSkeleton />}>
        <SearchResults locale={locale} searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function SearchResults({ locale, searchParams }: SearchPageProps) {
  const dictionary = getCatalogDictionary(locale);
  const term = readSearchTerm(await searchParams);
  const path = localizedPath(locale, SEARCH_PATH);

  return (
    <div className="grid gap-4">
      <form role="search" action={path} method="get" className="flex max-w-xl gap-2">
        <label className="sr-only" htmlFor="search-page-q">
          {dictionary.searchLabel}
        </label>
        <input
          id="search-page-q"
          name="q"
          type="search"
          defaultValue={term}
          placeholder={dictionary.searchLabel}
          className="h-10 flex-1 rounded-md border border-border bg-background px-3 text-sm"
        />
        <button
          type="submit"
          className="h-10 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
        >
          {dictionary.searchSubmit}
        </button>
      </form>
      {term ? (
        <ProductListing
          locale={locale}
          path={path}
          scope={{ searchTerm: term }}
          searchParams={searchParams}
          extra={{ q: term }}
        />
      ) : (
        <p className="text-muted-foreground">{dictionary.searchPrompt}</p>
      )}
    </div>
  );
}
