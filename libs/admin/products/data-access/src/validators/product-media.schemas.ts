import { z } from 'zod';

/** Runtime shape of `GET/PUT /api/admin/products/{id}/media`. */
const mediaItemSchema = z.object({
  id: z.number().int().min(1),
  url: z.string().min(1),
  fileName: z.string(),
});

export const productMediaSchema = z.object({
  productId: z.number().int().min(1),
  photos: z.array(mediaItemSchema),
  scheme: mediaItemSchema.nullish(),
});
