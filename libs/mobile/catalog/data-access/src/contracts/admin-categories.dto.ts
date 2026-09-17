import type { operations } from '@shared/api-contracts';

export type AdminCategoryDto =
  operations['getAdminCategories']['responses'][200]['content']['application/json'][number];
