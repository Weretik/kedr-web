import { getProductListPage } from '@site/catalog/data-access';
import {
  hasListingFilters,
  isIndexableListing,
  listingHref,
  parseListingQuery,
  withoutFilters,
} from '@site/catalog/model';
import { buildProductItemListJsonLd } from '@site/catalog/seo';
import {
  ListingEmpty,
  ListingPagination,
  FilterForm,
  ListingSummary,
  ListingToolbar,
  PerPageLinks,
  ProductList,
  getCatalogDictionary,
} from '@site/catalog/ui';
import { JsonLd } from '@site/core/seo';

import type { ProductListScope } from '@site/catalog/data-access';
import type { SearchParamsRecord } from '@site/catalog/model';
import type { Locale } from '@site/core/i18n';
import type { ReactNode } from 'react';

type ProductListingProps = {
  locale: Locale;
  /** Localized path of the listing page. */
  path: string;
  scope: ProductListScope;
  searchParams: Promise<SearchParamsRecord>;
  /** URL entries that are not listing choices, such as the search term `q`. */
  extra?: Record<string, string>;
};

/**
 * Filters on the left (desktop), then the sort and view row, products, the shown range with the page-size choice, and page links for one listing page. It reads the URL, so it renders
 * inside `<Suspense>`; products come from the cached loader keyed by scope and normalized choices.
 */
export async function ProductListing({
  locale,
  path,
  scope,
  searchParams,
  extra,
}: ProductListingProps) {
  const dictionary = getCatalogDictionary(locale);
  const query = parseListingQuery(await searchParams);
  const page = await getProductListPage(locale, scope, query);

  const frame = (content: ReactNode) => (
    <div className="grid gap-6 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-8">
      <aside aria-label={dictionary.filters} className="hidden lg:block">
        <FilterForm dictionary={dictionary} path={path} query={query} extra={extra ?? {}} />
      </aside>
      <div className="grid min-w-0 content-start gap-4">
        <ListingToolbar locale={locale} path={path} query={query} extra={extra} />
        {content}
      </div>
    </div>
  );

  if (!page) return frame(<ListingEmpty locale={locale} reason="unavailable" />);

  if (!page.items.length) {
    const pastEnd = query.page > 1 && page.totalRecords > 0;
    const reason = pastEnd ? 'page' : hasListingFilters(query) ? 'filtered' : 'none';
    const resetQuery = pastEnd ? { ...query, page: 1 } : withoutFilters(query);
    return frame(
      <ListingEmpty
        locale={locale}
        reason={reason}
        resetHref={listingHref(path, resetQuery, extra)}
      />,
    );
  }

  const from = (page.page - 1) * page.pageSize + 1;
  const to = from + page.items.length - 1;

  return frame(
    <>
      <ProductList locale={locale} products={page.items} view={query.view} />
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
        <ListingSummary locale={locale} from={from} to={to} total={page.totalRecords} />
        <PerPageLinks locale={locale} path={path} query={query} extra={extra} />
      </div>
      <ListingPagination
        locale={locale}
        path={path}
        query={query}
        totalPages={page.totalPages}
        extra={extra}
      />
      {isIndexableListing(query) && (
        <JsonLd data={buildProductItemListJsonLd(locale, page.items)} />
      )}
    </>,
  );
}
