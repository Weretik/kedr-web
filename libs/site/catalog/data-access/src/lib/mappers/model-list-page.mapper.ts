import { toProductPhotoUrl } from './photo-url';

import type { components } from '@shared/api-contracts';
import type {
  ListingFilter,
  ProductListPage,
  ProductSummary,
  ProductSwatch,
} from '@site/catalog/model';

type ModelList = components['schemas']['PublicSiteModelList'];
type ModelCard = components['schemas']['PublicSiteModelCard'];
type Swatch = components['schemas']['PublicSiteModelSwatch'];
type Filter = components['schemas']['PublicSiteModelFilter'];

const HEX = /^#[0-9a-f]{6}$/i;

/** Texture pictures come from the same image CDN as product photos; any other address is dropped. */
const mapSwatch = (swatch: Swatch): ProductSwatch => ({
  slug: swatch.slug,
  name: swatch.name,
  hex: swatch.hex && HEX.test(swatch.hex) ? swatch.hex : null,
  textureUrl: toProductPhotoUrl(swatch.textureUrl),
});

export function mapModelCard(card: ModelCard): ProductSummary {
  return {
    id: card.slug,
    sku: card.productCount === 1 ? (card.productId ?? null) : null,
    slug: card.slug,
    name: card.name.trim(),
    price: typeof card.priceFrom === 'number' && card.priceFrom > 0 ? card.priceFrom : null,
    variantCount: card.productCount,
    colors: card.colors.map(mapSwatch),
    photoUrl: toProductPhotoUrl(card.photo),
    inStock: card.inStock,
    isNew: card.isNew,
    isSale: card.isSale,
  };
}

const mapFilter = (filter: Filter): ListingFilter => ({
  code: filter.code,
  slug: filter.slug,
  name: filter.name,
  display: filter.display,
  values: filter.values.map((value) => ({
    ...mapSwatch(value),
    count: value.count,
    selected: value.selected,
  })),
});

export function mapModelListPage(page: ModelList): ProductListPage {
  return {
    items: page.items.map(mapModelCard),
    page: page.page,
    pageSize: page.pageSize,
    totalPages: page.totalPages,
    totalRecords: page.totalRecords,
    filters: page.filters.map(mapFilter).filter((filter) => filter.values.length > 0),
    exactMatch: page.exactMatch
      ? { slug: page.exactMatch.modelSlug, selection: page.exactMatch.selection }
      : null,
  };
}
