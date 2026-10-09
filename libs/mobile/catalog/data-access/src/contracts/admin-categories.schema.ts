import { toApiError } from '@mobile/shared/api-client';
import { z } from 'zod';

const adminCategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  shortNameUk: z.string(),
  shortNameRu: z.string(),
  slug: z.string(),
  productTypeIdOneC: z.string(),
  parentId: z.number().nullable(),
  sortOrder: z.number(),
  level: z.number(),
});

const adminCategoriesSchema = z.array(adminCategorySchema);

export function parseAdminCategories(response: unknown) {
  const parsed = adminCategoriesSchema.safeParse(response);
  if (!parsed.success) throw toApiError(parsed.error);
  return parsed.data;
}
