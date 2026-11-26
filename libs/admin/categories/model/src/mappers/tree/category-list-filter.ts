import { missingContentLanguages } from '../../entities/admin-category';

import type { AdminCategory } from '../../entities/admin-category';

/** Filter chips of the category table (spec 003 R-002). */
export type CategoryListFilter = 'missingText' | 'hidden' | 'closed' | 'manual';

export const categoryListFilters: readonly { value: CategoryListFilter; label: string }[] = [
  { value: 'missingText', label: 'Без тексту' },
  { value: 'hidden', label: 'Сховані' },
  { value: 'closed', label: 'Закриті від пошуку' },
  { value: 'manual', label: 'Створені вручну' },
];

/** Whether a category passes one chip. */
export function matchesCategoryFilter(
  category: AdminCategory,
  filter: CategoryListFilter,
): boolean {
  switch (filter) {
    case 'missingText':
      return (missingContentLanguages(category)?.length ?? 0) > 0;
    case 'hidden':
      return !category.isShownOnSite;
    case 'closed':
      return category.isClosedFromSearch;
    case 'manual':
      return category.isManual;
  }
}

/** How many categories each chip keeps. */
export function categoryFilterCounts(
  categories: readonly AdminCategory[],
): Record<CategoryListFilter, number> {
  const counts = { missingText: 0, hidden: 0, closed: 0, manual: 0 };
  for (const category of categories)
    for (const { value } of categoryListFilters)
      if (matchesCategoryFilter(category, value)) counts[value] += 1;
  return counts;
}

/** Names (1C, short and site, both languages), the address, or the exact ID contain the term. */
export function categorySearchMatches(category: AdminCategory, term: string): boolean {
  const needle = term.trim().toLocaleLowerCase('uk');
  if (!needle) return true;
  if (String(category.id) === needle) return true;
  return [
    category.nameUk,
    category.nameRu,
    category.siteNameUk,
    category.siteNameRu,
    category.sourceName,
    category.slug,
  ].some((value) => value?.toLocaleLowerCase('uk').includes(needle));
}
