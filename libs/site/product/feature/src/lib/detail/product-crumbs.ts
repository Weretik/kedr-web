import { CATALOG_PATH, categoryPath, isHiddenCategoryId } from '@site/catalog/model';
import { localizedPath } from '@site/core/i18n';
import { productPath } from '@site/product/model';
import { getProductDictionary } from '@site/product/ui';

import type { Locale } from '@site/core/i18n';
import type { ProductDetails } from '@site/product/model';

export type ProductCrumb = { name: string; href: string };

/** One visible trail is shared by the detail view and BreadcrumbList. */
export function productCrumbs(locale: Locale, product: ProductDetails): ProductCrumb[] {
  const dictionary = getProductDictionary(locale);
  const crumbs: ProductCrumb[] = [
    { name: dictionary.home, href: localizedPath(locale, '/') },
    { name: dictionary.catalog, href: localizedPath(locale, CATALOG_PATH) },
  ];
  const seen = new Set(crumbs.map((crumb) => crumb.href));
  for (const crumb of product.breadcrumbs) {
    if (isHiddenCategoryId(crumb.id)) continue;
    const href = localizedPath(locale, categoryPath(crumb.slug));
    if (!seen.has(href)) crumbs.push({ name: crumb.name, href });
    seen.add(href);
  }
  crumbs.push({ name: product.name, href: localizedPath(locale, productPath(product.slug)) });
  return crumbs;
}
