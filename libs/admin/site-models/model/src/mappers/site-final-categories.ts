import { siteCategoryAncestors } from '../entities/showcase/site-category-tree';

import type { SiteCategoryRef } from '../entities/showcase/site-showcase';

/** A category a model can live in: one without subcategories, with its path for the picker. */
export interface SiteFinalCategory {
  id: number;
  name: string;
  /** «Фурнітура / Завіси». */
  path: string;
}

/** Final categories (no children in the list) sorted by their path. */
export function siteFinalCategories(categories: readonly SiteCategoryRef[]): SiteFinalCategory[] {
  const parents = new Set(categories.map((category) => category.parentId));
  const names = new Map(categories.map((category) => [category.id, category.name] as const));
  return categories
    .filter((category) => !parents.has(category.id))
    .map((category) => ({
      id: category.id,
      name: category.name,
      path: [
        ...siteCategoryAncestors(categories, category.id)
          .reverse()
          .map((id) => names.get(id) ?? ''),
        category.name,
      ].join(' / '),
    }))
    .sort((left, right) => left.path.localeCompare(right.path, 'uk'));
}
