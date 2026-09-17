import { ProductSort } from './product-sort.enum';

export type GetProductListQuery = {
  searchTerm?: string;

  inStock?: boolean;
  isSale?: boolean;
  isNew?: boolean;

  priceTypeId?: number;
  priceFrom?: number;
  priceTo?: number;

  sort?: ProductSort;

  page?: number;
  pageSize?: number;
};
