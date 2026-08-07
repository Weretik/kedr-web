export type CatalogSort = 'IdAsc' | 'IdDesc' | 'NameAsc' | 'NameDesc' | 'PriceAsc' | 'PriceDesc';

export interface CatalogFilterSelection {
  categoryId?: number;
  categorySlug?: string;
  inStock?: boolean;
  isNew?: boolean;
  isSale?: boolean;
  priceFrom?: number;
  priceTo?: number;
}

export interface CatalogQuery {
  filters: CatalogFilterSelection;
  page: number;
  search: string;
  sort: CatalogSort;
}

export const defaultCatalogQuery: CatalogQuery = {
  filters: {},
  page: 1,
  search: '',
  sort: 'IdAsc',
};
