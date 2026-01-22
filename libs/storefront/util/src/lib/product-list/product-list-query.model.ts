export type ProductListQuery = {
  search?: string;
  categoryId?: string;

  inStock?: 'true' | 'false';
  isSale?: 'true' | 'false';
  isNew?: 'true' | 'false';

  priceTypeId?: string;
  priceFrom?: string;
  priceTo?: string;

  sort: ProductListSortUi;

  page: string;
  pageSize: string;
};

export type ProductListSortUi =
  | 'name-asc'
  | 'name-desc'
  | 'price-asc'
  | 'price-desc';
