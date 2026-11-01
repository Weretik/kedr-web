'use client';

import { Button } from '@site/shared/ui';
import { useState, useTransition } from 'react';

import { ListingSummary } from './listing-summary';
import { getCatalogDictionary } from '../i18n/catalog-dictionary';
import { ProductList } from '../product/product-list';

import type { ListingView, ProductListPage, ProductSummary } from '@site/catalog/model';
import type { Locale } from '@site/core/i18n';

type ShowMoreProps = {
  locale: Locale;
  view: ListingView;
  /** The page the server rendered, as the loader returned it; loading starts after it. */
  page: ProductListPage;
  /** Server Function bound to the listing scope and choices; returns `null` when the API fails. */
  loadPage: (page: number) => Promise<ProductListPage | null>;
};

/**
 * «Показати ще»: appends the next pages under the server-rendered one and keeps the shown range up to date;
 * page links stay for crawlers and visitors without JavaScript.
 */
export function ShowMore({ locale, view, page, loadPage }: ShowMoreProps) {
  const dictionary = getCatalogDictionary(locale);
  const [items, setItems] = useState<ProductSummary[]>([]);
  const [lastPage, setLastPage] = useState(page.page);
  const from = (page.page - 1) * page.pageSize + 1;
  const to = from + page.items.length + items.length - 1;
  const [failed, setFailed] = useState(false);
  const [pending, startTransition] = useTransition();

  const load = () =>
    startTransition(async () => {
      const next = await loadPage(lastPage + 1).catch(() => null);
      if (!next) {
        setFailed(true);
        return;
      }
      setFailed(false);
      setItems((current) => [...current, ...next.items]);
      setLastPage(next.page);
    });

  return (
    <>
      {items.length > 0 && <ProductList locale={locale} products={items} view={view} />}
      {failed && (
        <p role="alert" className="text-center text-sm text-muted-foreground">
          {dictionary.loadFailed}
        </p>
      )}
      <ListingSummary locale={locale} from={from} to={to} total={page.totalRecords} />
      {lastPage < page.totalPages && (
        <div className="flex justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={load}
            disabled={pending}
            aria-busy={pending}
          >
            {pending ? dictionary.loading : dictionary.showMore}
          </Button>
        </div>
      )}
    </>
  );
}
