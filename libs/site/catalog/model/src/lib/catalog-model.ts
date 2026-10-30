/** A top-level catalog category with its direct subcategories, in the backend's display order. */
export type CatalogSection = {
  id: number;
  slug: string;
  name: string;
  children: CatalogCategory[];
};

export type CatalogCategory = {
  id: number;
  slug: string;
  name: string;
};

/** Product data for cards and lists; `photoUrl` is `null` when the photo is missing or not on the image CDN. */
export type ProductSummary = {
  id: number;
  slug: string;
  name: string;
  /** Retail price in UAH, or `null` when the price is given on request. */
  price: number | null;
  photoUrl: string | null;
  isNew: boolean;
  isSale: boolean;
};
