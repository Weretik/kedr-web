import type { ProductsListSort } from './products-list-query';

/** «Без фото» filters only by search, category and actual stock. */
export interface MissingPhotoQuery {
  searchTerm?: string;
  hasStock?: boolean;
  categoryId?: number;
  sort: ProductsListSort;
  page: number;
  pageSize: number;
}
