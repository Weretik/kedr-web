export type ProductListQuery = {
  search?: string;
  categoryId?: string;

  inStock?: '1' | '0';
  isSale?: '1' | '0';
  isNew?: '1' | '0';

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
