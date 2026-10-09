import { AppErrorFactory } from '@shared/util';
import { z } from 'zod';

const productListItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  productSlug: z.string(),
  photo: z.string(),
  categoryId: z.number().nullable().optional(),
  inStock: z.boolean(),
  isSale: z.boolean(),
  isNew: z.boolean(),
  price: z.number().nullable().optional(),
});

const pagedInfoSchema = z.object({
  pageNumber: z.number(),
  pageSize: z.number(),
  totalPages: z.number(),
  totalRecords: z.number(),
});

const productPageSchema = z.object({
  pagedInfo: pagedInfoSchema,
  value: z.array(productListItemSchema),
});

const productDetailsSchema = z.object({
  id: z.number(),
  name: z.string(),
  photo: z.string(),
  scheme: z.string(),
  stock: z.number(),
  categoryName: z.string(),
  categorySlug: z.string(),
  quantityInPack: z.number(),
  price: z.number().nullable().optional(),
  breadcrumbs: z.array(z.object({ id: z.number(), name: z.string(), slug: z.string() })),
});

function parseResponse<T>(schema: z.ZodType<T>, response: unknown): T {
  const parsed = schema.safeParse(response);
  if (!parsed.success) throw AppErrorFactory.unknown(parsed.error);
  return parsed.data;
}

export const parseProductPage = (response: unknown) => parseResponse(productPageSchema, response);

export const parseProductDetails = (response: unknown) => {
  const product = parseResponse(productDetailsSchema, response);
  return { ...product, price: product.price ?? null };
};
