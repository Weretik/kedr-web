import type { ProductSeoInput } from './product-seo-input';

/** One product of a model for its ProductGroup markup. */
export type ProductGroupVariantInput = {
  name: string;
  sku: string;
  /** Localized path with the variant's query, for example `/uk/product/zavisa?kolir=khrom`. */
  path: string;
  image: string | null;
  price: number | null;
  inStock: boolean;
  /** schema.org properties the variants differ by, for example `{ color: 'Хром' }`. */
  properties: Readonly<Partial<Record<'color' | 'size', string>>>;
};

/** A model page: its canonical identity plus every product as a variant. */
export type ProductGroupSeoInput = {
  page: ProductSeoInput;
  groupId: string;
  variesBy: readonly ('color' | 'size')[];
  variants: readonly ProductGroupVariantInput[];
};
