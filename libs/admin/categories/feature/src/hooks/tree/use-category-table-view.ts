import {
  buildCategoryTree,
  categoryFilterCounts,
  categoryTableRows,
  filterCategoryTree,
  matchesCategoryFilter,
  parentCategoryIds,
} from '@admin/categories/model';
import { useMemo, useState } from 'react';

import type { AdminCategory, CategoryListFilter } from '@admin/categories/model';

/**
 * The state of the category tree table (spec 003 R-001, R-002): open parents (top-level ones at first), search,
 * filter chips, and the visible rows.
 */
export function useCategoryTableView(categories: readonly AdminCategory[]) {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<ReadonlySet<CategoryListFilter>>(new Set());
  const [opened, setOpened] = useState<ReadonlySet<number> | null>(null);

  const tree = useMemo(() => buildCategoryTree(categories), [categories]);
  const parentIds = useMemo(() => parentCategoryIds(tree), [tree]);
  const openIds = useMemo(
    () =>
      opened ??
      new Set(tree.filter((node) => node.children.length > 0).map((node) => node.category.id)),
    [opened, tree],
  );
  const filtering = Boolean(search.trim()) || filters.size > 0;
  const rows = useMemo(() => {
    const keep =
      filters.size > 0
        ? (category: AdminCategory) =>
            [...filters].every((filter) => matchesCategoryFilter(category, filter))
        : undefined;
    return categoryTableRows(filterCategoryTree(tree, search, keep).tree, openIds, filtering);
  }, [tree, search, filters, openIds, filtering]);
  const counts = useMemo(() => categoryFilterCounts(categories), [categories]);
  const allOpen = parentIds.length > 0 && parentIds.every((id) => openIds.has(id));

  return {
    rows,
    counts,
    search,
    filters,
    filtering,
    allOpen,
    setSearch,
    toggleFilter: (filter: CategoryListFilter) =>
      setFilters((current) => {
        const next = new Set(current);
        if (!next.delete(filter)) next.add(filter);
        return next;
      }),
    toggleOpen: (categoryId: number) => {
      const next = new Set(openIds);
      if (!next.delete(categoryId)) next.add(categoryId);
      setOpened(next);
    },
    toggleAll: () => setOpened(allOpen ? new Set() : new Set(parentIds)),
  };
}
