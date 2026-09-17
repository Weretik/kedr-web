import { publicProductDetailsSchema } from '../contracts/public-product-details.schema';

import type { PublicProductDetailsDto } from '../contracts/public-product-details.dto';
import type { CatalogProductDetails } from '@mobile/catalog/model';

const optionalUrl = (value: string): string | null => {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

export function mapPublicProductDetails(dto: PublicProductDetailsDto): CatalogProductDetails {
  const parsed = publicProductDetailsSchema.parse(dto);

  return {
    breadcrumbs: parsed.breadcrumbs.map((breadcrumb) => ({
      id: String(breadcrumb.id),
      name: breadcrumb.name,
      slug: breadcrumb.slug,
    })),
    categoryName: parsed.categoryName,
    categorySlug: parsed.categorySlug,
    id: String(parsed.id),
    imageUrl: optionalUrl(parsed.photo),
    name: parsed.name,
    price: parsed.price ?? null,
    quantityInPack: parsed.quantityInPack,
    schemeUrl: optionalUrl(parsed.scheme),
    stock: parsed.stock,
  };
}
