import type { components } from '@shared/api-contracts';
import type { CatalogTreeNode } from '@site/catalog/model';

type CategoryTreeNode = components['schemas']['CategoryTreeNode'];

export const bySortOrder = (a: CategoryTreeNode, b: CategoryTreeNode) =>
  a.sortOrder - b.sortOrder || a.id - b.id;

export const hasRoute = (node: CategoryTreeNode) =>
  node.slug.trim() !== '' && node.name.trim() !== '';

/** The whole tree in display order with counts; nodes without a slug or name are dropped with their subtrees. */
export function mapCatalogTree(nodes: readonly CategoryTreeNode[]): CatalogTreeNode[] {
  return nodes
    .filter(hasRoute)
    .sort(bySortOrder)
    .map((node) => ({
      id: node.id,
      slug: node.slug,
      name: node.name.trim(),
      productCount: node.productCount,
      children: mapCatalogTree(node.children),
    }));
}
