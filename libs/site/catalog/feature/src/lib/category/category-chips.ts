import type { CatalogTreeNode } from '@site/catalog/model';

const findParent = (
  nodes: readonly CatalogTreeNode[],
  id: number,
  parent: CatalogTreeNode | null,
): CatalogTreeNode | null | undefined => {
  for (const node of nodes) {
    if (node.id === id) return parent;
    const found = findParent(node.children, id, node);
    if (found !== undefined) return found;
  }
  return undefined;
};

/**
 * Chips under the category heading: its subcategories, or, for a category without them, its siblings with the
 * category itself among them, so the visitor can move sideways. A top-level leaf gets no chips.
 */
export function categoryChips(
  children: readonly CatalogTreeNode[],
  id: number,
  tree: readonly CatalogTreeNode[] | null,
): readonly CatalogTreeNode[] {
  if (children.length) return children;
  return (tree && findParent(tree, id, null)?.children) ?? [];
}
