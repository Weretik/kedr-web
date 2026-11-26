import { categoryPath, orderCategoryTree } from './category-tree-order';

import type { AdminCategory } from '../entities/admin-category';

/** One choice of «Вкласти в»: a category with its path, or the top level (`id` is `null`). */
export interface CategoryParentOption {
  id: number | null;
  label: string;
  /** Names from the root, for example «Фурнітура / Ручки»; empty for the top level. */
  path: string;
}

export const topLevelLabel = 'Верхній рівень';

/**
 * «Вкласти в» choices in tree order: the top level first, then every category with its path. A moved category and its
 * subcategories are left out, since a category cannot go under itself (spec 002 R-005).
 */
export function categoryParentOptions(
  categories: readonly AdminCategory[],
  excludeId?: number,
): CategoryParentOption[] {
  const byId = new Map(categories.map((row) => [row.id, row]));
  const inside = (row: AdminCategory) => {
    const seen = new Set<number>();
    for (let current: AdminCategory | undefined = row; current && !seen.has(current.id);) {
      if (current.id === excludeId) return true;
      seen.add(current.id);
      current = current.parentId === null ? undefined : byId.get(current.parentId);
    }
    return false;
  };

  return [
    { id: null, label: topLevelLabel, path: '' },
    ...orderCategoryTree(categories)
      .filter((row) => excludeId === undefined || !inside(row))
      .map((row) => ({ id: row.id, label: row.nameUk, path: categoryPath(row, byId).join(' / ') })),
  ];
}

/** Whether «Вище» and «Нижче» can move the category among its neighbours (sort order, then id). */
export function categoryNeighbourPosition(
  categories: readonly AdminCategory[],
  category: AdminCategory,
): { canMoveUp: boolean; canMoveDown: boolean } {
  const ids = new Set(categories.map((row) => row.id));
  const parentOf = (row: AdminCategory) =>
    row.parentId !== null && ids.has(row.parentId) ? row.parentId : null;
  const siblings = categories
    .filter((row) => parentOf(row) === parentOf(category))
    .sort((left, right) => left.sortOrder - right.sortOrder || left.id - right.id);
  const index = siblings.findIndex((row) => row.id === category.id);
  return { canMoveUp: index > 0, canMoveDown: index >= 0 && index < siblings.length - 1 };
}

/** What «Нова категорія» asks for (spec 002 R-001). */
export interface NewCategoryDraft {
  nameUk: string;
  nameRu: string;
  parentId: number | null;
  isShownOnSite: boolean;
}

export const categoryNameMaxLength = 100;

/** The message under a name field, or `undefined` when the name is fine. */
export function categoryNameError(name: string): string | undefined {
  const trimmed = name.trim();
  if (!trimmed) return 'Вкажіть назву.';
  return trimmed.length > categoryNameMaxLength
    ? `Не довше ${categoryNameMaxLength} символів.`
    : undefined;
}
