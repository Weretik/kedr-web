import { createFilterOptions } from '@mui/material';

import type { ProductCategoryOption } from '@admin/products/model';
import type { FilterOptionsState } from '@mui/material';

const filterCategories = createFilterOptions<ProductCategoryOption>({
  stringify: (option) => option.pathUk,
});

/** Without a search term shows only options under expanded parents; with one shows matches and their ancestors. */
export function filterCategoryTree(
  options: ProductCategoryOption[],
  state: FilterOptionsState<ProductCategoryOption>,
  expandedIds: ReadonlySet<number>,
  searchTerm: string,
) {
  const byId = new Map(options.map((option) => [option.id, option]));
  if (!searchTerm.trim()) {
    return options.filter((option) => {
      let parentId = option.parentId;
      const visited = new Set([option.id]);
      while (parentId !== null) {
        if (visited.has(parentId) || !expandedIds.has(parentId)) return false;
        visited.add(parentId);
        parentId = byId.get(parentId)?.parentId ?? null;
      }
      return true;
    });
  }

  const matches = filterCategories(options, { ...state, inputValue: searchTerm });
  const visibleIds = new Set<number>();

  for (const match of matches) {
    let current: ProductCategoryOption | undefined = match;
    while (current && !visibleIds.has(current.id)) {
      visibleIds.add(current.id);
      current = current.parentId === null ? undefined : byId.get(current.parentId);
    }
  }

  return options.filter((option) => visibleIds.has(option.id));
}

export function categoryAncestorIds(
  categories: readonly ProductCategoryOption[],
  categoryId: number,
): Set<number> {
  const byId = new Map(categories.map((category) => [category.id, category]));
  const ancestors = new Set<number>();
  let parentId = byId.get(categoryId)?.parentId;
  while (parentId != null && !ancestors.has(parentId)) {
    ancestors.add(parentId);
    parentId = byId.get(parentId)?.parentId;
  }
  return ancestors;
}
