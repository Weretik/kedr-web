export interface ProductBreadcrumb {
  id: number;
  name: string;
  slug: string;
}

export interface ProductDetails {
  id: number;
  name: string;
  photo: string;
  scheme: string;
  stock: number;
  categoryName: string;
  categorySlug: string;
  quantityInPack: number;
  price: number | null;
  breadcrumbs: ProductBreadcrumb[];
}
