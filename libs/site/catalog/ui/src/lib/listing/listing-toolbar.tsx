'use client';

import { hasListingFilters, listingHref } from '@site/catalog/model';
import { LayoutGridIcon, ListIcon, SlidersHorizontalIcon } from 'lucide-react';

import { FilterForm } from './filter-form';
import { SortSelect } from './sort-select';
import { ViewLink } from './toolbar-controls';
import { getCatalogDictionary } from '../i18n/catalog-dictionary';
import { ToolbarPopover } from '../popover/toolbar-popover';

import type { ListingQuery, ListingView } from '@site/catalog/model';
import type { Locale } from '@site/core/i18n';

type ListingToolbarProps = {
  locale: Locale;
  /** Localized path of the listing, for example `/uk/catalog/ruchky`. */
  path: string;
  query: ListingQuery;
  /** Entries that are not listing choices but belong to the URL, such as the search term `q`. */
  extra?: Record<string, string>;
};

const NO_EXTRA: Record<string, string> = {};

/**
 * Row above the products: sort and the card or table view. On phones and tablets the filters, which sit in the
 * left column on desktop, open from an icon here; a dot on it marks active filters.
 */
export function ListingToolbar({ locale, path, query, extra = NO_EXTRA }: ListingToolbarProps) {
  const dictionary = getCatalogDictionary(locale);
  const viewHref = (view: ListingView) => listingHref(path, { ...query, view }, extra);

  return (
    <div className="flex items-center justify-end gap-2">
      <div className="mr-auto lg:hidden">
        <ToolbarPopover
          label={dictionary.filters}
          marked={hasListingFilters(query)}
          icon={<SlidersHorizontalIcon className="size-4" strokeWidth={1.75} />}
          panelClassName="right-auto left-0 w-72"
        >
          {(close) => (
            <FilterForm locale={locale} path={path} query={query} extra={extra} onDone={close} />
          )}
        </ToolbarPopover>
      </div>
      <SortSelect dictionary={dictionary} path={path} query={query} extra={extra} />
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
  );
}
