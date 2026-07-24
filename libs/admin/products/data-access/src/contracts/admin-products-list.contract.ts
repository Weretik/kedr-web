export interface AdminProductsListResponse {
  pagedInfo: AdminProductsPagedInfo;
  value: unknown[];
}

export interface AdminProductsPagedInfo {
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
}

export interface AdminProductsListParams {
  SearchTerm?: string;
  InStock?: boolean;
  IsSale?: boolean;
  IsNew?: boolean;
  PriceFrom?: number;
  PriceTo?: number;
  Sort: number;
  Page: number;
  PageSize: number;
}
