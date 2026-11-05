import type { Category } from '../entities/product';
import type { CategoryParents } from '../pricing/customer-price';

export function parentsOf(categories: readonly Category[]): CategoryParents {
  return new Map(categories.map((category) => [category.id, category.parentId]));
}

const byOrder = (a: Category, b: Category) =>
  a.sortOrder - b.sortOrder || a.name.localeCompare(b.name, 'uk');

/** Direct children of a category, or the roots for null, in catalog order. */
export function childrenOf(categories: readonly Category[], parentId: number | null): Category[] {
  return categories.filter((category) => category.parentId === parentId).sort(byOrder);
}

/** The category and every category under it (a cycle stops the walk). */
export function withDescendants(categories: readonly Category[], categoryId: number): Set<number> {
  const found = new Set<number>([categoryId]);
  const queue = [categoryId];
  while (queue.length > 0) {
    const current = queue.shift() as number;
    for (const child of categories) {
      if (child.parentId === current && !found.has(child.id)) {
        found.add(child.id);
        queue.push(child.id);
      }
    }
  }
  return found;
}

/** Root first, the category last; unknown ids end the path. */
export function categoryPath(categories: readonly Category[], categoryId: number): Category[] {
  const byId = new Map(categories.map((category) => [category.id, category]));
  const path: Category[] = [];
  let current = byId.get(categoryId);
  while (current && path.length < 32 && !path.includes(current)) {
    path.unshift(current);
    current = current.parentId === null ? undefined : byId.get(current.parentId);
  }
  return path;
}
