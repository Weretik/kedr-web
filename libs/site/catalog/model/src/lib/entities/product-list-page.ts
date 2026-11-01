import type { ProductSummary } from './catalog-model';

/** One page of a product listing with the totals of the whole filtered list. */
export type ProductListPage = {
  items: ProductSummary[];
  page: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
};
