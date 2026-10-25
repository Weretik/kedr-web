import { toApiError } from '@mobile/shared/api-client';
import { z } from 'zod';

const missingPhotoProductSchema = z.object({
  id: z.number().int(),
  nameUk: z.string(),
  nameRu: z.string(),
  productSlug: z.string(),
  photo: z.string(),
  categoryId: z.number().int().nullable().optional(),
  categoryName: z.string(),
  inStock: z.boolean(),
  isSale: z.boolean(),
  isNew: z.boolean(),
  exportToSite: z.boolean(),
  price: z.number().nullable().optional(),
  stock: z.number(),
  quantityInPack: z.number().int(),
  photoAvailable: z.literal(false),
  photoStatus: z.enum(['Missing', 'InvalidContentType', 'CheckFailed']),
  photoCheckedAtUtc: z.string().datetime({ offset: true }),
  photoHttpStatusCode: z.number().int().min(100).max(599).nullable(),
});

const missingPhotoProductPageSchema = z.object({
  pagedInfo: z.object({
    pageNumber: z.number().int(),
    pageSize: z.number().int(),
    totalPages: z.number().int(),
    totalRecords: z.number().int(),
  }),
  value: z.array(missingPhotoProductSchema),
});

export function parseMissingPhotoProductPage(response: unknown) {
  const parsed = missingPhotoProductPageSchema.safeParse(response);
  if (!parsed.success) throw toApiError(parsed.error);
  return parsed.data;
}
