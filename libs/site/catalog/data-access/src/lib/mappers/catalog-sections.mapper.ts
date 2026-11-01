import { bySortOrder, hasRoute } from './category-tree.mapper';

import type { components } from '@shared/api-contracts';
import type { CatalogCategory, CatalogSection } from '@site/catalog/model';

type CategoryTreeNode = components['schemas']['CategoryTreeNode'];

const toCategory = (node: CategoryTreeNode): CatalogCategory => ({
  id: node.id,
  slug: node.slug,
  name: node.name.trim(),
});

/** Top-level categories with their direct children, in display order; nodes without a slug or name are dropped. */
export function mapCatalogSections(tree: readonly CategoryTreeNode[]): CatalogSection[] {
  return tree
    .filter(hasRoute)
    .sort(bySortOrder)
    .map((node) => ({
      ...toCategory(node),
      children: node.children.filter(hasRoute).sort(bySortOrder).map(toCategory),
    }));
}
