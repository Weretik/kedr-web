import { publicCategoryNamesUk } from './public-category-names.uk';

import type { ProductCategoryOption } from '@admin/products/model';
import type { operations } from '@shared/api-contracts';

type AdminCategory =
  operations['getAdminCategories']['responses'][200]['content']['application/json'][number];

export function mapAdminProductCategories(response: unknown): ProductCategoryOption[] {
  if (!Array.isArray(response)) throw new Error('Invalid categories response.');
  const categories = response as AdminCategory[];
  for (const item of categories) {
    if (
      !item ||
      !Number.isInteger(item.id) ||
      item.id <= 0 ||
      typeof item.shortNameUk !== 'string' ||
      !(item.parentId === null || Number.isInteger(item.parentId))
    ) {
      throw new Error('Invalid category.');
    }
  }

  const byId = new Map(categories.map((item) => [item.id, item]));
  const parentIds = new Set(categories.map((item) => item.parentId));
  const ancestorsFor = (item: AdminCategory): AdminCategory[] => {
    const ancestors: AdminCategory[] = [];
    const seen = new Set<number>([item.id]);
    let current = item.parentId === null ? undefined : byId.get(item.parentId);
    while (current && !seen.has(current.id)) {
      seen.add(current.id);
      ancestors.unshift(current);
      current = current.parentId === null ? undefined : byId.get(current.parentId);
    }
    return ancestors;
  };
  const nameFor = (item: AdminCategory): string =>
    publicCategoryNamesUk[item.id] ?? (item.shortNameUk.trim() || 'Категорія без назви');
  const pathFor = (item: AdminCategory): string => {
    const names: string[] = [];
    for (const ancestor of ancestorsFor(item)) names.push(nameFor(ancestor));
    names.push(nameFor(item));
    return names.join(' ');
  };

  return categories.map((item) => ({
    id: item.id,
    parentId: item.parentId,
    nameUk: nameFor(item),
    pathUk: pathFor(item),
    depth: ancestorsFor(item).length,
    hasChildren: parentIds.has(item.id),
  }));
}
