import type { AdminCategoryDto } from '../contracts/admin-categories.contract';
import type { AdminCategory } from '@admin/categories/model';

export function mapAdminCategory(dto: AdminCategoryDto): AdminCategory {
  return {
    id: dto.id,
    nameUk: dto.shortNameUk.trim() || dto.name,
    nameRu: dto.shortNameRu.trim() || dto.name,
    sourceName: dto.name,
    slug: dto.slug,
    sourceKey: dto.productTypeIdOneC,
    parentId: dto.parentId,
    sortOrder: dto.sortOrder,
    level: dto.level,
    isDeleted: dto.isDeleted ?? false,
    deletedAt: dto.deletedAt ?? null,
  };
}

export const mapAdminCategories = (response: AdminCategoryDto[]): AdminCategory[] =>
  response.map(mapAdminCategory);
