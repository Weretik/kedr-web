export enum ProductSort {
  NameAsc = 0,
  NameDesc = 1,
  PriceAsc = 2,
  PriceDesc = 3,
}

export type GetProductListQuery = {
  SearchTerm?: string;
  CategoryId?: number;

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
