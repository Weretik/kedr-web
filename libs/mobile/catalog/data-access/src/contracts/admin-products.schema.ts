import { toApiError } from '@mobile/shared/api-client';
import { z } from 'zod';

const adminProductSchema = z.object({
  id: z.number(),
  nameUk: z.string(),
  nameRu: z.string(),
  productSlug: z.string(),
  photo: z.string(),
  categoryId: z.number().nullable().optional(),
  categoryName: z.string(),
  inStock: z.boolean(),
  isSale: z.boolean(),
  isNew: z.boolean(),
  exportToSite: z.boolean(),
  price: z.number().nullable().optional(),
  stock: z.number(),
  quantityInPack: z.number(),
});

const adminProductPageSchema = z.object({
  pagedInfo: z.object({
    pageNumber: z.number(),
    pageSize: z.number(),
    totalPages: z.number(),
    totalRecords: z.number(),
  }),
  value: z.array(adminProductSchema),
});

export function parseAdminProductPage(response: unknown) {
  const parsed = adminProductPageSchema.safeParse(response);
  if (!parsed.success) throw toApiError(parsed.error);
  return parsed.data;
}
