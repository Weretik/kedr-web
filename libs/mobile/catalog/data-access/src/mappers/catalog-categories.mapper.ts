import type { AdminCategoryDto } from '../contracts/admin-categories.dto';
import type { CatalogCategoryOption } from '@mobile/catalog/model';

const maximumCategoryDepth = 2;

export function mapAdminCategories(rows: readonly AdminCategoryDto[]): CatalogCategoryOption[] {
  const duplicateIds = findDuplicateIds(rows);
  const categoriesById = new Map(
    rows
      .filter((row) => !duplicateIds.has(row.id) && isValidCategoryRow(row))
      .map((row) => [row.id, row]),
  );

  const childrenByParentId = new Map<number | null, AdminCategoryDto[]>();
  for (const category of categoriesById.values()) {
    if (category.parentId !== null && !categoriesById.has(category.parentId)) continue;

    const siblings = childrenByParentId.get(category.parentId) ?? [];
    siblings.push(category);
    childrenByParentId.set(category.parentId, siblings);
  }

  for (const siblings of childrenByParentId.values()) {
    siblings.sort((left, right) => left.sortOrder - right.sortOrder || left.id - right.id);
  }

  return (childrenByParentId.get(null) ?? []).flatMap((category) =>
    buildCategory(category, 0, childrenByParentId),
  );
}

function buildCategory(
  category: AdminCategoryDto,
  depth: number,
  childrenByParentId: ReadonlyMap<number | null, readonly AdminCategoryDto[]>,
): CatalogCategoryOption[] {
  if (category.level !== depth || depth > maximumCategoryDepth) return [];

  return [
    {
      children: (childrenByParentId.get(category.id) ?? []).flatMap((child) =>
        buildCategory(child, depth + 1, childrenByParentId),
      ),
      id: category.id,
      label: category.shortNameUk.trim() || category.shortNameRu.trim(),
    },
  ];
}

function findDuplicateIds(rows: readonly AdminCategoryDto[]): ReadonlySet<number> {
  const ids = new Set<number>();
  const duplicates = new Set<number>();

  for (const row of rows) {
    if (ids.has(row.id)) duplicates.add(row.id);
    ids.add(row.id);
  }

  return duplicates;
}

function isValidCategoryRow(category: AdminCategoryDto): boolean {
  return (
    Number.isInteger(category.id) &&
    category.id > 0 &&
    Number.isInteger(category.level) &&
    category.level >= 0 &&
    (category.parentId === null ||
      (Number.isInteger(category.parentId) && category.parentId > 0)) &&
    Number.isInteger(category.sortOrder) &&
    category.sortOrder >= 0 &&
    Boolean(category.shortNameUk.trim() || category.shortNameRu.trim())
  );
}
