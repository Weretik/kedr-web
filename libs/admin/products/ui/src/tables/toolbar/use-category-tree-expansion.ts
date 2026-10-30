import { useCallback, useEffect, useState } from 'react';

import { categoryAncestorIds } from './category-tree-filter';

import type { ProductCategoryOption } from '@admin/products/model';

/** Expanded tree nodes of the category picker; the selected category's parents open automatically. */
export function useCategoryTreeExpansion(
  categories: readonly ProductCategoryOption[],
  categoryId: number | undefined,
) {
  const [expandedIds, setExpandedIds] = useState<ReadonlySet<number>>(() => new Set());

  useEffect(() => {
    if (categoryId === undefined) return;
    const ancestors = categoryAncestorIds(categories, categoryId);
    if (ancestors.size > 0) {
      setExpandedIds((previous) => new Set([...previous, ...ancestors]));
    }
  }, [categories, categoryId]);

  const toggle = useCallback((id: number) => {
    setExpandedIds((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  return { expandedIds, toggle };
}
