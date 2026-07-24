export type ProductsListSort =
  'id-asc' | 'id-desc' | 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc';

export interface ProductsListQuery {
  searchTerm?: string;
  inStock?: boolean;
  isSale?: boolean;
  isNew?: boolean;
  priceFrom?: number;
  priceTo?: number;
  sort: ProductsListSort;
  page: number;
  pageSize: number;
}

export interface AdminProductListItem {
  id: number;
  nameUk: string;
  nameRu: string;
  productSlug: string;
  photo: string;
  categoryId: number | null;
  inStock: boolean;
  isSale: boolean;
  isNew: boolean;
  price: number | null;
  stock: number;
  quantityInPack: number;
}

export interface ProductsListPage {
  items: AdminProductListItem[];
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
}

export const DEFAULT_PRODUCTS_LIST_QUERY: ProductsListQuery = {
  inStock: true,
  page: 1,
  pageSize: 20,
  sort: 'id-asc',
};
