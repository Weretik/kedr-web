/** One switch value of a model axis; `key` is the value slug used in the page query. */
export type SiteModelAxisValue = {
  key: string;
  name: string;
  hex: string | null;
  textureUrl: string | null;
};

/** A switcher of the model page (color, size, side). */
export type SiteModelAxis = {
  /** Attribute code (`color`, `size`, `side`); slugs can be renamed, codes cannot. */
  code: string;
  slug: string;
  name: string;
  display: 'swatch' | 'button';
  values: SiteModelAxisValue[];
};

/** Axis slug → value key. */
export type SiteModelSelection = Readonly<Record<string, string>>;

/** One on-site product of the model with its axis values. */
export type SiteModelProduct = {
  sku: string;
  name: string;
  slug: string;
  photoUrl: string | null;
  price: number | null;
  inStock: boolean;
  isMain: boolean;
  selection: SiteModelSelection;
};

export type SiteModelTexts = {
  shortDescription: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
};

export type SiteModelCharacteristic = { name: string; values: string[] };

/**
 * A site page that joins 1C products (spec site/product/002). `isAccepted` false is a product shown as a model of
 * its own: the page stays the product page.
 */
export type SiteModel = {
  slug: string;
  name: string;
  isAccepted: boolean;
  categorySlug: string;
  texts: SiteModelTexts;
  mainProductSlug: string | null;
  axes: SiteModelAxis[];
  /** In stock first, then by name. */
  products: SiteModelProduct[];
  characteristics: SiteModelCharacteristic[];
};

export type SiteModelResult =
  | { kind: 'ok'; model: SiteModel }
  /** A former model slug or a product inside an accepted model: permanent redirect to the model. */
  | { kind: 'moved'; modelSlug: string; selection: SiteModelSelection }
  | { kind: 'not-found' }
  | { kind: 'unavailable' };
