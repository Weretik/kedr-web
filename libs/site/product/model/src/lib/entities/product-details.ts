export type ProductBreadcrumb = { id: number; name: string; slug: string };

export type ProductMediaItem = { kind: 'photo' | 'scheme'; url: string };

/** Public retail facts, normalized from the server contract before reaching UI or SEO. */
export type ProductDetails = {
  sku: string;
  slug: string;
  name: string;
  price: number | null;
  inStock: boolean;
  quantityInPack: number | null;
  categoryName: string;
  categorySlug: string | null;
  breadcrumbs: ProductBreadcrumb[];
  media: ProductMediaItem[];
  updatedAt: string | null;
};
