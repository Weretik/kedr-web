import {
  buildCategoryTree,
  categoryAncestorIds,
  expandableCategoryIds,
  filterCategoryTree,
  missingContentLanguages,
} from '@admin/categories/model';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import type { AdminCategory } from '@admin/categories/model';

const hasMissingText = (category: AdminCategory) =>
  (missingContentLanguages(category)?.length ?? 0) > 0;

/**
 * The tree side of «Провідник»: search, «без текстів» filter, expanded rows, and the selected
 * category kept in `?category=` so a link or the back button returns to it.
 */
export function useCategoryTreeView(categories: readonly AdminCategory[]) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [onlyMissingText, setOnlyMissingText] = useState(false);
  const [expanded, setExpanded] = useState<string[] | null>(null);

  const byId = useMemo(() => new Map(categories.map((row) => [row.id, row])), [categories]);
  const tree = useMemo(() => buildCategoryTree(categories), [categories]);
  const filtered = useMemo(
    () => filterCategoryTree(tree, search, onlyMissingText ? hasMissingText : undefined),
    [tree, search, onlyMissingText],
  );
  const missingTextCount = useMemo(() => categories.filter(hasMissingText).length, [categories]);
  const filtering = Boolean(search.trim()) || onlyMissingText;

  const selected = byId.get(Number(searchParams.get('category'))) ?? tree[0]?.category;
  const ancestorIds = useMemo(
    () => (selected ? categoryAncestorIds(selected.id, byId) : []),
    [byId, selected],
  );

  // Until the person expands or collapses something, the path to the selected category is open.
  const expandedIds = filtering
    ? expandableCategoryIds(filtered.tree)
    : (expanded ?? ancestorIds.map(String));

  const select = (categoryId: number) => {
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        next.set('category', String(categoryId));
        return next;
      },
      { replace: true },
    );
    // Opening a category from the overview keeps its path visible in the tree.
    setExpanded((current) => {
      const path = categoryAncestorIds(categoryId, byId).map(String);
      const base = current ?? ancestorIds.map(String);
      return [...new Set([...base, ...path])];
    });
  };

  return {
    byId,
    selected,
    ancestors: ancestorIds.flatMap((id) => byId.get(id) ?? []),
    tree: filtered.tree,
    expandedIds,
    missingTextCount,
    search,
    setSearch,
    onlyMissingText,
    setOnlyMissingText,
    setExpanded: (ids: string[]) => {
      if (!filtering) setExpanded(ids);
    },
    select,
  };
}
