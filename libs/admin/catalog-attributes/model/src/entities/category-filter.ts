/** An attribute offered as a filter in one category. */
export interface CategoryFilter {
  attributeId: number;
  code: string;
  name: string;
  isFilterable: boolean;
  sortOrder: number;
  isEditedManually: boolean;
  /** Products of the category with a value of the attribute. */
  productCount: number;
}

/** A category shown on the site, in the «Фільтри категорій» tree. */
export interface FilterCategory {
  id: number;
  name: string;
  parentId: number | null;
  /** Attributes the category itself offers as filters. */
  filterCount: number;
}

/** A category of the tree with its subcategories; filters are set only in a final one (no children). */
export interface FilterCategoryNode {
  category: FilterCategory;
  path: string;
  children: readonly FilterCategoryNode[];
}

/** Builds the tree (a category whose parent is missing becomes a top one), each node with its full path. */
export function filterCategoryTree(categories: readonly FilterCategory[]): FilterCategoryNode[] {
  const ids = new Set(categories.map((category) => category.id));
  const byParent = new Map<number | null, FilterCategory[]>();
  for (const category of categories) {
    const parent =
      category.parentId !== null && ids.has(category.parentId) ? category.parentId : null;
    byParent.set(parent, [...(byParent.get(parent) ?? []), category]);
  }
  const build = (
    parent: number | null,
    path: string,
    seen: ReadonlySet<number>,
  ): FilterCategoryNode[] =>
    (byParent.get(parent) ?? [])
      .filter((category) => !seen.has(category.id))
      .map((category) => {
        const own = path ? `${path} › ${category.name}` : category.name;
        return {
          category,
          path: own,
          children: build(category.id, own, new Set([...seen, category.id])),
        };
      });
  return build(null, '', new Set());
}

/** Final categories without any filter: on the site they show no filter panel. */
export function countFinalWithoutFilters(nodes: readonly FilterCategoryNode[]): number {
  return nodes.reduce(
    (total, node) =>
      total +
      (node.children.length === 0
        ? node.category.filterCount === 0
          ? 1
          : 0
        : countFinalWithoutFilters(node.children)),
    0,
  );
}

/** Finds a node of the tree by category id. */
export function findFilterCategory(
  nodes: readonly FilterCategoryNode[],
  id: number | undefined,
): FilterCategoryNode | undefined {
  if (id === undefined) return undefined;
  for (const node of nodes) {
    if (node.category.id === id) return node;
    const found = findFilterCategory(node.children, id);
    if (found) return found;
  }
  return undefined;
}

/** Moves a filter one step up or down and renumbers the order by tens. */
export function moveFilter(
  filters: readonly CategoryFilter[],
  index: number,
  offset: -1 | 1,
): CategoryFilter[] {
  const target = index + offset;
  if (target < 0 || target >= filters.length) return [...filters];
  const next = [...filters];
  [next[index], next[target]] = [next[target], next[index]];
  return next.map((filter, position) => ({ ...filter, sortOrder: (position + 1) * 10 }));
}
