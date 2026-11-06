import { isValidProductSlug } from '@site/product/model';

import { mapProductMedia } from './product-media';

import type {
  ApiSiteModel,
  ApiSiteModelAddress,
  ApiSiteModelAxis,
  ApiSiteModelProduct,
} from '../contracts/product.dto';
import type {
  SiteModel,
  SiteModelAxis,
  SiteModelProduct,
  SiteModelSelection,
} from '@site/product/model';

const HEX = /^#[0-9a-f]{6}$/i;

const photoUrl = (value: string | null | undefined) =>
  mapProductMedia([value], null, null)[0]?.url ?? null;

const mapAxis = (axis: ApiSiteModelAxis): SiteModelAxis => ({
  code: axis.code,
  slug: axis.slug,
  name: axis.name,
  display: axis.display === 'swatch' ? 'swatch' : 'button',
  values: axis.values.map((value) => ({
    key: value.key,
    name: value.name,
    hex: value.hex && HEX.test(value.hex) ? value.hex : null,
    textureUrl: photoUrl(value.textureUrl),
  })),
});

const mapProduct = (product: ApiSiteModelProduct): SiteModelProduct => ({
  sku: String(product.id),
  name: product.name,
  slug: product.slug,
  photoUrl: photoUrl(product.photo),
  price: typeof product.price === 'number' && product.price > 0 ? product.price : null,
  inStock: product.inStock,
  isMain: product.isMain,
  selection: { ...product.selection },
});

/** A model without a valid product slug cannot open a variant, so it is treated as missing. */
export function mapSiteModel(dto: ApiSiteModel): SiteModel | null {
  const products = dto.products
    .filter((product) => isValidProductSlug(product.slug))
    .map(mapProduct);
  if (!isValidProductSlug(dto.slug) || products.length === 0) return null;
  return {
    slug: dto.slug,
    name: dto.name,
    isAccepted: dto.isAccepted,
    categorySlug: dto.category.slug,
    texts: {
      shortDescription: dto.texts.shortDescription.trim(),
      description: dto.texts.description.trim(),
      seoTitle: dto.texts.seoTitle.trim(),
      seoDescription: dto.texts.seoDescription.trim(),
    },
    mainProductSlug: dto.mainProductSlug,
    axes: dto.axes.map(mapAxis).filter((axis) => axis.values.length > 0),
    products,
    characteristics: dto.characteristics
      .map((item) => ({ name: item.name, values: item.values.filter((value) => value.trim()) }))
      .filter((item) => item.values.length > 0),
  };
}

/** A 404 body that names a model address; anything else is a plain 404. */
export function parseModelAddress(
  body: unknown,
): { modelSlug: string; selection: SiteModelSelection } | null {
  if (!body || typeof body !== 'object') return null;
  const { modelSlug, selection } = body as Partial<ApiSiteModelAddress>;
  if (!isValidProductSlug(modelSlug)) return null;
  const clean: Record<string, string> = {};
  if (selection && typeof selection === 'object') {
    for (const [axis, key] of Object.entries(selection)) {
      if (typeof key === 'string' && key) clean[axis] = key;
    }
  }
  return { modelSlug, selection: clean };
}
