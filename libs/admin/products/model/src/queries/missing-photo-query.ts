import type { ProductsListSort } from './products-list-query';

/** «Без фото» and «На сайті без фото» filter only by search, category and actual stock. */
export interface MissingPhotoQuery {
  searchTerm?: string;
  hasStock?: boolean;
  /** Set by «На сайті без фото»: only products published on the site. */
  exportToSite?: boolean;
  categoryId?: number;
  sort: ProductsListSort;
  page: number;
  pageSize: number;
}
