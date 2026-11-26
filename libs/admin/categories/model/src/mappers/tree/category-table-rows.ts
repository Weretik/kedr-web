import { siteNameOf } from '../../entities/admin-category';

import type { CategoryTreeNode } from './category-tree-nodes';
import type { AdminCategory } from '../../entities/admin-category';

/** One visible row of the category tree table (spec 003 R-001). */
export interface CategoryTableRow {
  id: number;
  category: AdminCategory;
  /** 0 for a top-level category. */
  depth: number;
  hasChildren: boolean;
  open: boolean;
  /** Site names of the ancestors, from the top down; empty at the top level. */
  path: string[];
}

/**
 * Flattens the tree into the rows a person sees: a parent's children follow it only while the parent is open.
 * `openAll` opens every parent (a search or a chip is active).
 */
export function categoryTableRows(
  tree: readonly CategoryTreeNode[],
  openIds: ReadonlySet<number>,
  openAll = false,
): CategoryTableRow[] {
  const rows: CategoryTableRow[] = [];
  const visit = (node: CategoryTreeNode, depth: number, path: string[]) => {
    const hasChildren = node.children.length > 0;
    const open = hasChildren && (openAll || openIds.has(node.category.id));
    rows.push({ id: node.category.id, category: node.category, depth, hasChildren, open, path });
    if (!open) return;
    const childPath = [...path, siteNameOf(node.category)];
    for (const child of node.children) visit(child, depth + 1, childPath);
  };
  for (const node of tree) visit(node, 0, []);
  return rows;
}

/** Ids of every category with children, for «Розгорнути все». */
export function parentCategoryIds(tree: readonly CategoryTreeNode[]): number[] {
  const ids: number[] = [];
  const visit = (node: CategoryTreeNode) => {
    if (node.children.length === 0) return;
    ids.push(node.category.id);
    node.children.forEach(visit);
  };
  tree.forEach(visit);
  return ids;
}
