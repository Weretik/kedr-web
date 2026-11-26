import { z } from 'zod';

import { adminCategorySchema } from '../validators/admin-category.schemas';

import type { AdminCategory } from '@admin/categories/model';

export function mapAdminCategory(data: unknown): AdminCategory {
  const dto = adminCategorySchema.parse(data);
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
    isShownOnSite: dto.isShownOnSite ?? false,
    productCount: dto.productCount ?? null,
    filledLanguages: dto.filledContentLanguages
      ? dto.filledContentLanguages.filter((language) => language === 'uk' || language === 'ru')
      : null,
    siteNameUk: dto.siteNameUk?.trim() || null,
    siteNameRu: dto.siteNameRu?.trim() || null,
    isClosedFromSearch: dto.isClosedFromSearch ?? false,
    sharePicture:
      typeof dto.shareImageMediaFileId === 'number'
        ? { mediaFileId: dto.shareImageMediaFileId, url: dto.shareImageUrl ?? null }
        : null,
  };
}

export const mapAdminCategories = (data: unknown): AdminCategory[] =>
  z.array(z.unknown()).parse(data).map(mapAdminCategory);
