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

/** A color chip of a model card: a `#RRGGBB` color, a texture picture, or neither (text only). */
export type ProductSwatch = {
  slug: string;
  name: string;
  hex: string | null;
  textureUrl: string | null;
};

/**
 * A card of a listing: a site model (spec site/product/002). A model of several products links to its page with
 * the lowest price and its colors; a model of one product is that product with its article and cart action.
 * `photoUrl` is `null` when the photo is missing or not on the image CDN.
 */
export type ProductSummary = {
  /** The page slug, unique in a list. */
  id: string;
  /** Article shown to customers: the 1C code of the only product; `null` for a model of several products. */
  sku: number | null;
  slug: string;
  name: string;
  /** Retail price in UAH (the lowest of the model's matching products), or `null` when given on request. */
  price: number | null;
  /** On-site products of the model; above 1 the card shows «від» and the number of variants. */
  variantCount: number;
  colors: ProductSwatch[];
  photoUrl: string | null;
  inStock: boolean;
  isNew: boolean;
  isSale: boolean;
};
