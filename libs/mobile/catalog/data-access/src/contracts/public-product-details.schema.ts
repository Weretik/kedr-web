import { toApiError } from '@mobile/shared/api-client';
import { z } from 'zod';

export const publicProductDetailsSchema = z.object({
  id: z.number(),
  name: z.string(),
  photo: z.string(),
  scheme: z.string(),
  stock: z.number(),
  categoryName: z.string(),
  categorySlug: z.string(),
  quantityInPack: z.number(),
  price: z.number().nullable().optional(),
  breadcrumbs: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      slug: z.string(),
    }),
  ),
});

export function parsePublicProductDetails(response: unknown) {
  const parsed = publicProductDetailsSchema.safeParse(response);
  if (!parsed.success) throw toApiError(parsed.error);
  return parsed.data;
}
