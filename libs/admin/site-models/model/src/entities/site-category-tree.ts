import type { SiteModelCategory } from './site-showcase';

/** A category of the «Моделі» and «Вітрина сайту» tree with its subcategories. */
export interface SiteCategoryNode {
  category: SiteModelCategory;
  children: readonly SiteCategoryNode[];
}

/**
 * Builds the tree from the flat list (sorted by name). A category whose parent is not in the list becomes a top one.
 */
export function siteCategoryTree(categories: readonly SiteModelCategory[]): SiteCategoryNode[] {
  const ids = new Set(categories.map((category) => category.id));
  const byParent = new Map<number | null, SiteModelCategory[]>();
  for (const category of categories) {
    const parent =
      category.parentId !== null && ids.has(category.parentId) ? category.parentId : null;
    byParent.set(parent, [...(byParent.get(parent) ?? []), category]);
  }

  const build = (parent: number | null, seen: ReadonlySet<number>): SiteCategoryNode[] =>
    (byParent.get(parent) ?? [])
      .filter((category) => !seen.has(category.id))
      .map((category) => ({
        category,
        children: build(category.id, new Set([...seen, category.id])),
      }));

  return build(null, new Set());
}

/** IDs of a category's ancestors present in the list, nearest first. */
export function siteCategoryAncestors(
  categories: readonly SiteModelCategory[],
  categoryId: number | undefined,
): number[] {
  const byId = new Map(categories.map((category) => [category.id, category] as const));
  const result: number[] = [];
  let current = categoryId === undefined ? undefined : byId.get(categoryId);
  while (
    current?.parentId != null &&
    byId.has(current.parentId) &&
    !result.includes(current.parentId)
  ) {
    result.push(current.parentId);
    current = byId.get(current.parentId);
  }
  return result;
}
