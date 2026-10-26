export interface CatalogCategoryOption {
  children: readonly CatalogCategoryOption[];
  id: number;
  label: string;
}

export interface CatalogCategoryPathItem {
  id: number;
  label: string;
}

/** Path from the root to the category with `categoryId`, or undefined when it is not in the tree. */
export function findCatalogCategoryPath(
  categories: readonly CatalogCategoryOption[],
  categoryId: number | undefined,
  parentPath: readonly CatalogCategoryPathItem[] = [],
): readonly CatalogCategoryPathItem[] | undefined {
  if (categoryId === undefined) return undefined;

  for (const category of categories) {
    const path = [...parentPath, { id: category.id, label: category.label }];
    if (category.id === categoryId) return path;
    const childPath = findCatalogCategoryPath(category.children, categoryId, path);
    if (childPath) return childPath;
  }

  return undefined;
}
