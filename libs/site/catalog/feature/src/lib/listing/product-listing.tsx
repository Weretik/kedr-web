import { getProductListPage } from '@site/catalog/data-access';
import {
  hasListingFilters,
  isIndexableListing,
  listingHref,
  parseListingQuery,
  productPath,
  withAttributeValue,
  withoutAttribute,
  withoutFilters,
} from '@site/catalog/model';
import { buildProductItemListJsonLd } from '@site/catalog/seo';
import {
  ListingEmpty,
  ListingPagination,
  ListingSummary,
  PerPageLinks,
  ProductList,
} from '@site/catalog/ui';
import { localizedPath } from '@site/core/i18n';
import { JsonLd } from '@site/core/seo';
import { redirect } from 'next/navigation';

import { ListingFrame } from './listing-frame';
import { listingPurchaseDescriptor } from './listing-purchase';

import type { RenderListingPurchaseAction } from './listing-purchase';
import type { ProductListScope } from '@site/catalog/data-access';
import type { ListingLanding, SearchParamsRecord } from '@site/catalog/model';
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
  renderPurchaseAction?: RenderListingPurchaseAction;
  /**
   * A value page (`/catalog/zavisy/khrom`): its value is part of the list but not of the links, which stay on
   * `path`; the filters send their choices to `filterPath`, the category, with the value checked.
   */
  landing?: ListingLanding;
  filterPath?: string;
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
  renderPurchaseAction,
  landing,
  filterPath = path,
}: ProductListingProps) {
  const parsed = parseListingQuery(await searchParams);
  // Links of a value page keep its value in the path; the list and the filters include it.
  const query = landing ? withoutAttribute(parsed, landing.attribute) : parsed;
  const listQuery = landing ? withAttributeValue(query, landing.attribute, landing.value) : query;
  const page = await getProductListPage(locale, scope, listQuery);

  // An exact 1C code opens its model with that product chosen (spec site/product/002 D-06).
  if (page?.exactMatch && 'searchTerm' in scope && query.page === 1) {
    const selection = new URLSearchParams(page.exactMatch.selection).toString();
    const href = localizedPath(locale, productPath(page.exactMatch.slug));
    redirect(selection ? `${href}?${selection}` : href);
  }

  const filters = page?.filters ?? [];
  const frame = (content: ReactNode) => (
    <ListingFrame
      locale={locale}
      path={path}
      filterPath={filterPath}
      query={query}
      listQuery={listQuery}
      extra={extra}
      filters={filters}
    >
      {content}
    </ListingFrame>
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
      <ProductList
        locale={locale}
        products={page.items}
        view={query.view}
        renderAction={
          renderPurchaseAction &&
          ((product) => {
            const descriptor = listingPurchaseDescriptor(product);
            return descriptor ? renderPurchaseAction(descriptor) : null;
          })
        }
      />
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
