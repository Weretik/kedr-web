import { productPath } from '@site/product/model';

import type { ProductCrumb } from '../detail/product-crumbs';
import type { Locale } from '@site/core/i18n';
import type { ProductDetails } from '@site/product/model';
import type { ProductSeoInput } from '@site/product/seo';

export function productSeoInput(
  locale: Locale,
  product: ProductDetails,
  crumbs: readonly ProductCrumb[],
  languagePaths: Partial<Record<Locale, string>>,
): ProductSeoInput {
  return {
    locale,
    path: productPath(product.slug),
    name: product.name,
    sku: product.sku,
    categoryName: product.categoryName,
    price: product.price,
    inStock: product.inStock,
    images: product.media.map((item) => item.url),
    breadcrumbs: crumbs.map(({ name, href }) => ({ name, path: href })),
    languagePaths,
  };
}
