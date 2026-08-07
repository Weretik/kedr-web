interface AdminPagedInfoDto {
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
}

interface AdminProductDto {
  id: number;
  inStock?: boolean;
  nameRu: string;
  nameUk: string;
  photo?: string | null;
  price: number | null;
  productSlug: string;
}

export interface AdminProductPageDto {
  pagedInfo: AdminPagedInfoDto;
  value: AdminProductDto[];
}
