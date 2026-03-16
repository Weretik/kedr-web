export interface ProductBreadcrumbDto {
  id: number;
  name: string;
  slug: string;
}

export interface ProductBySlugDto {
  id: number;
  name: string;
  photo: string;
  scheme: string;
  stock: number;
  categoryName: string;
  categorySlug: string;
  quantityInPack: number;
  price: number;
  breadcrumbs: ProductBreadcrumbDto[];
}
