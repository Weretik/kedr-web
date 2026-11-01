import { getCatalogTree } from '@site/catalog/data-access';
import { CATALOG_PATH, CATALOG_ROOTS, categoryPath } from '@site/catalog/model';
import { MegaMenu } from '@site/catalog/ui';

import type { Locale } from '@site/core/i18n';
import type { CatalogNavigation } from '@site/core/shell';

const WHOLESALE_PATH = '/wholesale';

/**
 * Header navigation from the category tree: the mega menu and the top-level sections. `undefined` when the
 * tree is unavailable, so the shell falls back to its fixed sections.
 */
export async function getCatalogNavigation(locale: Locale): Promise<CatalogNavigation | undefined> {
  const tree = await getCatalogTree(locale);
  if (!tree?.length) return undefined;

  return {
    menu: (
      <MegaMenu
        locale={locale}
        tree={tree}
        catalogPath={CATALOG_PATH}
        wholesalePath={WHOLESALE_PATH}
        // Doors are a separate business line: their section closes the rail after a divider.
        separateIds={[CATALOG_ROOTS.doorsId]}
      />
    ),
    links: tree.map((section) => ({
      key: String(section.id),
      path: categoryPath(section.slug),
      label: section.name,
    })),
  };
}
