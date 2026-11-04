export interface ProductBreadcrumb {
  id: number;
  name: string;
  slug: string;
}

export interface ProductDetails {
  id: number;
  name: string;
  /** First photo URL; an empty string when the product has no photo. */
  photo: string;
  /** Scheme URL; an empty string when the product has no scheme. */
  scheme: string;
  /** All photo URLs in gallery order. */
  photos?: string[];
  stock: number;
  categoryName: string;
  categorySlug: string;
  quantityInPack: number;
  price: number | null;
  breadcrumbs: ProductBreadcrumb[];
}
