import type { AdminProductListItem } from '../entities/admin-product-list-item';

export interface ProductsListPage {
  items: AdminProductListItem[];
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
}
