import { CATALOG_ROOTS } from '@site/catalog/model';

import type { components } from '@shared/api-contracts';
import type { CatalogTreeNode } from '@site/catalog/model';

type CategoryTreeNode = components['schemas']['CategoryTreeNode'];

export const bySortOrder = (a: CategoryTreeNode, b: CategoryTreeNode) =>
  a.sortOrder - b.sortOrder || a.id - b.id;

export const hasRoute = (node: CategoryTreeNode) =>
  node.slug.trim() !== '' && node.name.trim() !== '';

const mapNode = (node: CategoryTreeNode): CatalogTreeNode => ({
  id: node.id,
  slug: node.slug,
  name: node.name.trim(),
  productCount: node.productCount,
  children: mapCatalogTree(node.children),
});

/** The whole tree in display order with counts; nodes without a slug or name are dropped with their subtrees. */
export function mapCatalogTree(nodes: readonly CategoryTreeNode[]): CatalogTreeNode[] {
  return [...nodes].filter(hasRoute).sort(bySortOrder).map(mapNode);
}

/** The API tree as the site shows it: {@link siteTopLevel}, then mapped like {@link mapCatalogTree}. */
export function mapSiteCatalogTree(nodes: readonly CategoryTreeNode[]): CatalogTreeNode[] {
  return siteTopLevel(nodes).filter(hasRoute).map(mapNode);
}

/**
 * The site's top level: «Фурнітура» is replaced by its sections, Cosmos is dropped, other roots (doors) follow.
 * Applied to the API tree before any other mapping.
 */
export function siteTopLevel(nodes: readonly CategoryTreeNode[]): CategoryTreeNode[] {
  return [...nodes].sort(bySortOrder).flatMap((node) => {
    if (node.id === CATALOG_ROOTS.cosmosId) return [];
    if (node.id === CATALOG_ROOTS.hardwareId) return [...node.children].sort(bySortOrder);
    return [node];
  });
}
