import type { AdminCategory } from '../entities/admin-category';

/**
 * Depth-first display order: each parent followed by its children, siblings by sort order then ID.
 * Rows whose parent is missing are shown as roots so none is lost.
 */
export function orderCategoryTree(categories: readonly AdminCategory[]): AdminCategory[] {
  const ids = new Set(categories.map((category) => category.id));
  const childrenByParent = new Map<number | null, AdminCategory[]>();

  for (const category of categories) {
    const parentId =
      category.parentId !== null && ids.has(category.parentId) ? category.parentId : null;
    const siblings = childrenByParent.get(parentId) ?? [];
    siblings.push(category);
    childrenByParent.set(parentId, siblings);
  }

  for (const siblings of childrenByParent.values()) {
    siblings.sort((left, right) => left.sortOrder - right.sortOrder || left.id - right.id);
  }

  const ordered: AdminCategory[] = [];
  const visited = new Set<number>();
  const visit = (category: AdminCategory) => {
    if (visited.has(category.id)) return;
    visited.add(category.id);
    ordered.push(category);
    for (const child of childrenByParent.get(category.id) ?? []) visit(child);
  };

  for (const root of childrenByParent.get(null) ?? []) visit(root);
  // Cycles have no root; append them so they still appear.
  for (const category of categories) visit(category);

  return ordered;
}

/** Ukrainian names from the root to the category, for example «Фурнітура / Завіси». */
export function categoryPath(
  category: AdminCategory,
  categoriesById: ReadonlyMap<number, AdminCategory>,
): string[] {
  const names: string[] = [];
  const seen = new Set<number>();
  let current: AdminCategory | undefined = category;

  while (current && !seen.has(current.id)) {
    seen.add(current.id);
    names.unshift(current.nameUk);
    current = current.parentId === null ? undefined : categoriesById.get(current.parentId);
  }

  return names;
}
