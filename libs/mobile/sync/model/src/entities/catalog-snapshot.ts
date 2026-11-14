import { z } from 'zod';

/**
 * `GET /api/mobile/sync/catalog` (KedrStore platform/004). Unknown fields are dropped, so the server may add
 * fields without breaking the app.
 */
export const catalogSnapshotSchema = z.object({
  version: z.string(),
  generatedAt: z.string(),
  retailPriceTypeId: z.number().int(),
  priceTypes: z.array(z.object({ id: z.number().int(), name: z.string() })),
  categories: z.array(
    z.object({
      id: z.number().int(),
      parentId: z.number().int().nullable(),
      name: z.string(),
      sortOrder: z.number().int(),
    }),
  ),
  products: z.array(
    z.object({
      id: z.number().int(),
      slug: z.string(),
      name: z.string(),
      categoryId: z.number().int(),
      stock: z.number(),
      inStock: z.boolean(),
      quantityInPack: z.number().int(),
      isSale: z.boolean(),
      isNew: z.boolean(),
      photos: z.array(z.string()),
      scheme: z.string().nullable(),
      prices: z.array(
        z.object({ priceTypeId: z.number().int(), amount: z.number().nonnegative() }),
      ),
    }),
  ),
});

export type CatalogSnapshot = z.infer<typeof catalogSnapshotSchema>;
