import { FilterForm, ListingToolbar, getCatalogDictionary } from '@site/catalog/ui';

import type { ListingFilter, ListingQuery } from '@site/catalog/model';
import type { Locale } from '@site/core/i18n';
import type { ReactNode } from 'react';

type ListingFrameProps = {
  locale: Locale;
  path: string;
  filterPath: string;
  /** The choices of the links; on a value page without its value. */
  query: ListingQuery;
  /** The choices of the list and the filters. */
  listQuery: ListingQuery;
  extra?: Record<string, string>;
  filters: readonly ListingFilter[];
  children: ReactNode;
};

/** Filters on the left (desktop) and the sort and view row above the listing content. */
export function ListingFrame({
  children,
  extra,
  filterPath,
  filters,
  listQuery,
  locale,
  path,
  query,
}: ListingFrameProps) {
  const dictionary = getCatalogDictionary(locale);

  return (
    <div className="grid gap-6 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-8">
      <aside aria-label={dictionary.filters} className="hidden lg:block">
        <FilterForm
          locale={locale}
          path={filterPath}
          query={listQuery}
          extra={extra ?? {}}
          filters={filters}
        />
      </aside>
      <div className="grid min-w-0 content-start gap-4">
        <ListingToolbar
          locale={locale}
          path={path}
          filterPath={filterPath}
          query={query}
          filterQuery={listQuery}
          extra={extra}
          filters={filters}
        />
        {children}
      </div>
    </div>
  );
}
