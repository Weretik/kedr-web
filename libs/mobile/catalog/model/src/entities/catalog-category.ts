export interface CatalogCategoryOption {
  children: readonly CatalogCategoryOption[];
  id: number;
  label: string;
}
