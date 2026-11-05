/** An attribute offered as a filter in one category. */
export interface CategoryFilter {
  attributeId: number;
  code: string;
  name: string;
  isFilterable: boolean;
  sortOrder: number;
  isEditedManually: boolean;
  /** Products of the category with a value of the attribute. */
  productCount: number;
}

/** A category to choose filters for. */
export interface FilterCategoryOption {
  id: number;
  name: string;
}

/** Moves a filter one step up or down and renumbers the order by tens. */
export function moveFilter(
  filters: readonly CategoryFilter[],
  index: number,
  offset: -1 | 1,
): CategoryFilter[] {
  const target = index + offset;
  if (target < 0 || target >= filters.length) return [...filters];
  const next = [...filters];
  [next[index], next[target]] = [next[target], next[index]];
  return next.map((filter, position) => ({ ...filter, sortOrder: (position + 1) * 10 }));
}
