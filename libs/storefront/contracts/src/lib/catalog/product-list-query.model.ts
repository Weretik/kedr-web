export type ProductListQuery = {
  search?: string;
  categoryId?: string;

  inStock?: 'true' | 'false';
  isSale?: 'true' | 'false';
  isNew?: 'true' | 'false';

  priceFrom?: string;
  priceTo?: string;

  sort: ProductListSortUi;

  page: string;
  pageSize: string;
};

export type ProductListSortUi =
  | 'id-asc'
  | 'id-desc'
  | 'name-asc'
  | 'name-desc'
  | 'price-asc'
  | 'price-desc';
