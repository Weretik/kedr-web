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

/** A category of the whole tree with its active exported products count, children in display order. */
export type CatalogTreeNode = CatalogCategory & {
  productCount: number;
  children: CatalogTreeNode[];
};

/** Product data for cards and lists; `photoUrl` is `null` when the photo is missing or not on the image CDN. */
export type ProductSummary = {
  id: number;
  /** Article shown to customers: the 1C product code. */
  sku: number;
  slug: string;
  name: string;
  /** Retail price in UAH, or `null` when the price is given on request. */
  price: number | null;
  photoUrl: string | null;
  inStock: boolean;
  isNew: boolean;
  isSale: boolean;
  /** On a category listing: variants of the product's group on the site, this one included (spec catalog/006). */
  variantCount?: number;
  /** On a category listing: the colors of the group's variants. */
  swatches?: ProductSwatch[];
};

/** A color: a circle (`hex`), a texture picture, or only the name when neither is set. */
export type ProductSwatch = {
  slug: string;
  name: string;
  hex: string | null;
  textureUrl: string | null;
};
