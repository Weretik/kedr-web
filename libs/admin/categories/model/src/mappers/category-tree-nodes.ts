import { orderCategoryTree } from './category-tree-order';

import type { AdminCategory } from '../entities/admin-category';

export interface CategoryTreeNode {
  category: AdminCategory;
  children: CategoryTreeNode[];
}

/** Nested tree in display order; a row whose parent is missing becomes a root, as in the list. */
export function buildCategoryTree(categories: readonly AdminCategory[]): CategoryTreeNode[] {
  const nodes = new Map<number, CategoryTreeNode>();
  const roots: CategoryTreeNode[] = [];

  for (const category of orderCategoryTree(categories)) {
    const node: CategoryTreeNode = { category, children: [] };
    nodes.set(category.id, node);
    const parent = category.parentId === null ? undefined : nodes.get(category.parentId);
    // Display order puts every parent before its children, so a missing parent means a root.
    if (parent) parent.children.push(node);
    else roots.push(node);
  }

  return roots;
}

/** IDs from the root down to the category's parent; the category itself is not included. */
export function categoryAncestorIds(
  categoryId: number,
  categoriesById: ReadonlyMap<number, AdminCategory>,
): number[] {
  const ids: number[] = [];
  const seen = new Set<number>([categoryId]);
  let parentId = categoriesById.get(categoryId)?.parentId ?? null;

  while (parentId !== null && !seen.has(parentId)) {
    const parent = categoriesById.get(parentId);
    if (!parent) break;
    seen.add(parentId);
    ids.unshift(parentId);
    parentId = parent.parentId;
  }

  return ids;
}

/**
 * Keeps the categories whose Ukrainian or Russian name or address contains the term (and that pass
 * `keep`, when given), together with their ancestors, so a found row is always shown in its place.
 */
export function filterCategoryTree(
  tree: readonly CategoryTreeNode[],
  term: string,
  keep?: (category: AdminCategory) => boolean,
): { tree: CategoryTreeNode[]; matchIds: Set<number> } {
  const needle = term.trim().toLocaleLowerCase('uk');
  const matchIds = new Set<number>();
  if (!needle && !keep) return { matchIds, tree: [...tree] };

  const matches = (category: AdminCategory) =>
    (!keep || keep(category)) &&
    (!needle ||
      [category.nameUk, category.nameRu, category.slug].some((value) =>
        value.toLocaleLowerCase('uk').includes(needle),
      ));

  const visit = (node: CategoryTreeNode): CategoryTreeNode | null => {
    const children = node.children
      .map(visit)
      .filter((child): child is CategoryTreeNode => child !== null);
    const own = matches(node.category);
    if (own) matchIds.add(node.category.id);
    return own || children.length > 0 ? { category: node.category, children } : null;
  };

  return {
    matchIds,
    tree: tree.map(visit).filter((node): node is CategoryTreeNode => node !== null),
  };
}
