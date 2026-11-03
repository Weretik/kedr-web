import { categoryPath } from '@site/catalog/model';
import { localizedPath } from '@site/core/i18n';

import type { Locale } from '@site/core/i18n';
import type { ProductDetails } from '@site/product/model';

/** The feature adapts the catalog owner's route policy to the product UI contract. */
export function productCategoryHref(locale: Locale, product: ProductDetails): string | null {
  return product.categorySlug ? localizedPath(locale, categoryPath(product.categorySlug)) : null;
}
