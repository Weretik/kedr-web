import type { AdminProductListItem, ProductCategoryOption } from '@admin/products/model';

export function productCategoryPath(
  product: Pick<AdminProductListItem, 'categoryId' | 'categoryName'>,
  categoriesById: ReadonlyMap<number, ProductCategoryOption>,
): string {
  const fallbackName = product.categoryName.trim();
  if (product.categoryId === null) return fallbackName || 'Категорію не вказано';

  const names: string[] = [];
  const seen = new Set<number>();
  let category = categoriesById.get(product.categoryId);
  while (category && !seen.has(category.id)) {
    seen.add(category.id);
    names.unshift(category.nameUk);
    category = category.parentId === null ? undefined : categoriesById.get(category.parentId);
  }

  return names.length > 0
    ? names.join(' › ')
    : fallbackName || `Категорія (ID ${product.categoryId})`;
}
