import { categoryAncestorIds } from './category-tree-nodes';

import type { AdminCategory } from '../../entities/admin-category';

/** How many categories sit anywhere under the given one. */
export function descendantCount(
  categories: readonly AdminCategory[],
  categoryId: number,
  categoriesById: ReadonlyMap<number, AdminCategory>,
): number {
  return categories.filter((row) =>
    categoryAncestorIds(row.id, categoriesById).includes(categoryId),
  ).length;
}

/** Direct children in display order. */
export function childCategoriesOf(
  categories: readonly AdminCategory[],
  categoryId: number,
): AdminCategory[] {
  return categories
    .filter((row) => row.parentId === categoryId)
    .sort((left, right) => left.sortOrder - right.sortOrder || left.id - right.id);
}
