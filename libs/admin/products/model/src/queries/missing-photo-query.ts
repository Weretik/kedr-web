import type { ProductsListSort } from './products-list-query';

export interface MissingPhotoQuery {
  searchTerm?: string;
  inStock?: boolean;
  isSale?: boolean;
  isNew?: boolean;
  exportToSite?: boolean;
  categoryId?: number;
  sort: ProductsListSort;
  page: number;
  pageSize: number;
}
