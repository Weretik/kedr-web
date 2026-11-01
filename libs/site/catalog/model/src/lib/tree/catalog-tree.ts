import type { CatalogTreeNode } from '../entities/catalog-model';

/** A category found by search with the names of its ancestors, for result labels. */
export type CategoryMatch = { node: CatalogTreeNode; path: string[] };

const normalize = (text: string) => text.toLocaleLowerCase('uk').replace(/\s+/g, ' ').trim();

/** Categories at any depth whose name contains every word of the term, in tree order. */
export function searchCatalogTree(
  tree: readonly CatalogTreeNode[],
  term: string,
  limit = 30,
): CategoryMatch[] {
  const words = normalize(term).split(' ').filter(Boolean);
  if (!words.length) return [];

  const matches: CategoryMatch[] = [];
  const walk = (nodes: readonly CatalogTreeNode[], path: string[]) => {
    for (const node of nodes) {
      if (matches.length >= limit) return;
      const name = normalize(node.name);
      if (words.every((word) => name.includes(word))) matches.push({ node, path });
      walk(node.children, [...path, node.name]);
    }
  };
  walk(tree, []);
  return matches;
}

/** IDs of every node that has children: the branches a tree view can collapse. */
export function branchIds(tree: readonly CatalogTreeNode[]): number[] {
  const ids: number[] = [];
  const walk = (nodes: readonly CatalogTreeNode[]) => {
    for (const node of nodes) {
      if (node.children.length) {
        ids.push(node.id);
        walk(node.children);
      }
    }
  };
  walk(tree);
  return ids;
}

/** Top-level sections and the IDs of nodes on the way to `categoryId` (inclusive), to highlight the path. */
export function ancestorIds(tree: readonly CatalogTreeNode[], categoryId: number): number[] {
  const find = (nodes: readonly CatalogTreeNode[], path: number[]): number[] | null => {
    for (const node of nodes) {
      const next = [...path, node.id];
      if (node.id === categoryId) return next;
      const found = find(node.children, next);
      if (found) return found;
    }
    return null;
  };
  return find(tree, []) ?? [];
}
