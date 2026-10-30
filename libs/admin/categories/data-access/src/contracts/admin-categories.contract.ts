import type { components } from '@shared/api-contracts';

export type AdminCategoryDto = components['schemas']['AdminCategory'];
export type AdminCategoryContentDto = components['schemas']['AdminCategoryContent'];
export type AdminCategoryContentItemDto = components['schemas']['AdminCategoryContentItem'];
export type SaveCategoryContentBody = components['schemas']['SaveCategoryContentRequest'];
export type ChangeSlugBody = components['schemas']['ChangeSlugRequest'];
export type ChangeSlugResult = components['schemas']['ChangeSlugResponse'];
