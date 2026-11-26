import {
  useGetAdminCategoriesQuery,
  useGetAdminCategoryQuery,
  useGetCategoryContentQuery,
} from '@admin/categories/data-access';
import {
  categoryAncestorIds,
  categoryProblems,
  childCategoriesOf,
  siteNameOf,
} from '@admin/categories/model';
import { useMemo } from 'react';

import type { AdminCategory } from '@admin/categories/model';

/**
 * Everything the category page shows (spec 003): the category read by id, with the counts and text languages of its
 * row in the active list, its ancestors, subcategories and what it lacks.
 */
export function useCategoryPageData(categoryId: number) {
  const valid = Number.isInteger(categoryId) && categoryId > 0;
  const categoryQuery = useGetAdminCategoryQuery(categoryId, { skip: !valid });
  const contentQuery = useGetCategoryContentQuery(categoryId, { skip: !valid });
  const listQuery = useGetAdminCategoriesQuery({ deleted: false }, { skip: !valid });
  const categories = useMemo(() => listQuery.data ?? [], [listQuery.data]);
  const detail = categoryQuery.data;

  const page = useMemo(() => {
    if (!detail) return null;
    const byId = new Map(categories.map((row) => [row.id, row]));
    const row = byId.get(detail.id);
    const category: AdminCategory = row
      ? {
          ...detail,
          productCount: row.productCount,
          filledLanguages: row.filledLanguages,
          modelCount: row.modelCount,
          proposedModelCount: row.proposedModelCount,
        }
      : detail;
    byId.set(category.id, category);
    const ancestors = categoryAncestorIds(category.id, byId).flatMap((id) => byId.get(id) ?? []);
    const children = childCategoriesOf(categories, category.id);
    const isFinal = children.length === 0;
    return {
      category,
      ancestors,
      path: ancestors.map((ancestor) => siteNameOf(ancestor)),
      children,
      isFinal,
      problems: categoryProblems(category, isFinal),
    };
  }, [detail, categories]);

  return {
    valid,
    page,
    categories,
    content: contentQuery,
    notFound: (categoryQuery.error as { code?: string } | undefined)?.code === 'NotFound',
    loading: categoryQuery.isLoading,
    error: categoryQuery.isError,
    retry: () => void categoryQuery.refetch(),
  };
}
