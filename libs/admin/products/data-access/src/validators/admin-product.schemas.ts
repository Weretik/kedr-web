import { z } from 'zod';

const positiveInt = z.number().int().min(1);
const nonNegativeInt = z.number().int().min(0);
const finite = z.number().finite();

/** Runtime shape of one row of `GET /api/admin/products`; the mapper receives data that passed it. */
export const adminProductListItemSchema = z.object({
  id: positiveInt,
  nameUk: z.string(),
  nameRu: z.string(),
  productSlug: z.string(),
  photo: z.string(),
  categoryId: finite.nullish(),
  categoryName: z.string(),
  inStock: z.boolean(),
  isSale: z.boolean(),
  isNew: z.boolean(),
  exportToSite: z.boolean(),
  price: finite.nullish(),
  stock: finite,
  quantityInPack: nonNegativeInt,
  deletedAt: z.unknown().optional(),
});

export const adminProductsPageSchema = z.object({
  pagedInfo: z.object({
    pageNumber: positiveInt,
    pageSize: positiveInt,
    totalPages: nonNegativeInt,
    totalRecords: nonNegativeInt,
  }),
  value: z.array(z.unknown()),
});

/** Runtime shape of `GET /api/admin/products/{slug}`. */
export const adminProductDetailsSchema = z.object({
  id: positiveInt,
  nameUk: z.string(),
  nameRu: z.string(),
  productSlug: z.string(),
  photo: z.string(),
  scheme: z.string(),
  stock: finite,
  categoryName: z.string(),
  categoryId: positiveInt,
  quantityInPack: nonNegativeInt,
  price: finite.nullable(),
  inStock: z.boolean(),
  isSale: z.boolean(),
  isNew: z.boolean(),
  exportToSite: z.boolean(),
});

/** The fields of a catalog category the product filters need. */
export const productCategorySchema = z.object({
  id: positiveInt,
  shortNameUk: z.string(),
  parentId: z.number().int().nullable(),
});
