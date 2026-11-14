import { z } from 'zod';

const languageSchema = z.enum(['uk', 'ru']);

/** Runtime shape of a catalog category; the mapper receives data that passed this schema. */
export const adminCategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  shortNameUk: z.string(),
  shortNameRu: z.string(),
  slug: z.string(),
  productTypeIdOneC: z.string(),
  parentId: z.number().nullable(),
  sortOrder: z.number(),
  level: z.number(),
  isDeleted: z.boolean().nullish(),
  deletedAt: z.string().nullish(),
  isShownOnSite: z.boolean().nullish(),
  productCount: z.number().nullish(),
  filledContentLanguages: z.array(z.string()).nullish(),
});

/** Runtime shape of the site texts of a category in one language. */
export const adminCategoryContentItemSchema = z.object({
  language: languageSchema,
  seoTitle: z.string().nullable(),
  metaDescription: z.string().nullable(),
  h1: z.string().nullable(),
  bodyHtml: z.string().nullable(),
  faq: z.array(z.object({ question: z.string(), answer: z.string() })),
  updatedAt: z.string(),
});

export const adminCategoryContentSchema = z.object({
  categoryId: z.number(),
  items: z.array(adminCategoryContentItemSchema),
});
