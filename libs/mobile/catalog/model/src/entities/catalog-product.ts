export type CatalogProductAvailability = 'in_stock' | 'out_of_stock' | 'unknown';

export interface CatalogProduct {
  availability: CatalogProductAvailability;
  id: string;
  imageUrl: string | null;
  name: string;
  price: number | null;
  productSlug: string;
}

export interface CatalogPage {
  items: CatalogProduct[];
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
}
