import { LOCALES, localizedPath } from '@site/core/i18n';
import { getProductDetails } from '@site/product/data-access';
import { productPath } from '@site/product/model';

import type { Locale } from '@site/core/i18n';
import type { ProductDetails } from '@site/product/model';

export async function getProductLanguagePaths(locale: Locale, product: ProductDetails) {
  const paths: Partial<Record<Locale, string>> = {
    [locale]: localizedPath(locale, productPath(product.slug)),
  };
  const other = LOCALES.find((candidate) => candidate !== locale);
  if (!other) return paths;
  const result = await getProductDetails(other, product.slug);
  if ((result.kind === 'ok' || result.kind === 'moved') && result.product.sku === product.sku) {
    paths[other] = localizedPath(other, productPath(result.product.slug));
  }
  return paths;
}
