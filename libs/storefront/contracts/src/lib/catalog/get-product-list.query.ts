import { ProductSort } from './product-sort.enum';

export type GetProductListQuery = {
  SearchTerm?: string;

  InStock?: boolean;
  IsSale?: boolean;
  IsNew?: boolean;

  PriceTypeId?: number;
  PriceFrom?: number;
  PriceTo?: number;

  Sort?: ProductSort;

  Page?: number;
  PageSize?: number;
};
