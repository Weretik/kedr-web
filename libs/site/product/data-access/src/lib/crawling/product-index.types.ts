import type { ProductIndexFailureReason, ProductIndexItem } from '@site/product/model';

export type ProductIndexPage = {
  items: ProductIndexItem[];
  page: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
};
export type ProductIndexPageResult =
  | { kind: 'ok'; page: ProductIndexPage }
  | { kind: 'unavailable'; reason: ProductIndexFailureReason };
export type ProductIndexPageReader = (page: number) => Promise<ProductIndexPageResult>;
