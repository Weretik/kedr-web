import type { ProductSummary } from './catalog-model';
import type { ListingExactMatch, ListingFilter } from './listing-filter';

/** One page of a listing with the totals of the whole filtered list. */
export type ProductListPage = {
  items: ProductSummary[];
  page: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
  /** Attribute filters with counts; empty outside a final category. */
  filters: ListingFilter[];
  /** Set when the search term is exactly the 1C code of an on-site product. */
  exactMatch: ListingExactMatch | null;
};
