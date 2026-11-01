import { CATALOG_PATH, categoryPath } from '@site/catalog/model';
import { getCatalogDictionary } from '@site/catalog/ui';
import { localizedPath } from '@site/core/i18n';

import type { CatalogCategory } from '@site/catalog/model';
import type { Locale } from '@site/core/i18n';

/** Home › Catalog › ancestors › category, with localized paths, for the visible trail and its JSON-LD. */
export function categoryCrumbs(locale: Locale, breadcrumbs: readonly CatalogCategory[]) {
  const dictionary = getCatalogDictionary(locale);
  return [
    { name: dictionary.home, path: localizedPath(locale) },
    { name: dictionary.catalog, path: localizedPath(locale, CATALOG_PATH) },
    ...breadcrumbs.map((crumb) => ({
      name: crumb.name,
      path: localizedPath(locale, categoryPath(crumb.slug)),
    })),
  ];
}
