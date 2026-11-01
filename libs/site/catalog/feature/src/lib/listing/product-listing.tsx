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
  ListingSummary,
  ListingToolbar,
  PerPageLinks,
  ProductList,
} from '@site/catalog/ui';
import { JsonLd } from '@site/core/seo';

import type { ProductListScope } from '@site/catalog/data-access';
import type { SearchParamsRecord } from '@site/catalog/model';
import type { Locale } from '@site/core/i18n';

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
 * Toolbar, products, the shown range with the page-size choice, and page links for one listing page. It reads the URL, so it renders
 * inside `<Suspense>`; products come from the cached loader keyed by scope and normalized choices.
 */
export async function ProductListing({
  locale,
  path,
  scope,
  searchParams,
  extra,
}: ProductListingProps) {
  const query = parseListingQuery(await searchParams);
  const page = await getProductListPage(locale, scope, query);

  const toolbar = <ListingToolbar locale={locale} path={path} query={query} extra={extra} />;
  if (!page) {
    return (
      <div className="grid gap-4">
        {toolbar}
        <ListingEmpty locale={locale} reason="unavailable" />
      </div>
    );
  }

  if (!page.items.length) {
    const pastEnd = query.page > 1 && page.totalRecords > 0;
    const reason = pastEnd ? 'page' : hasListingFilters(query) ? 'filtered' : 'none';
    const resetQuery = pastEnd ? { ...query, page: 1 } : withoutFilters(query);
    return (
      <div className="grid gap-4">
        {toolbar}
        <ListingEmpty
          locale={locale}
          reason={reason}
          resetHref={listingHref(path, resetQuery, extra)}
        />
      </div>
    );
  }

  const from = (page.page - 1) * page.pageSize + 1;
  const to = from + page.items.length - 1;

  return (
    <div className="grid gap-4">
      {toolbar}
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
    </div>
  );
}
