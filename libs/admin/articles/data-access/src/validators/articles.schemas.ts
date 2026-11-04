import { z } from 'zod';

/** Runtime shape of article responses; mappers receive data that passed these schemas. */
const language = z.enum(['uk', 'ru']);
const coverPath = z.string().startsWith('/').nullable();

export const adminArticleSummarySchema = z.object({
  id: z.number().int().min(1),
  slug: z.string().min(1),
  title: z.string(),
  publishedOn: z.string(),
  isPublished: z.boolean(),
  coverPath,
  updatedAt: z.string(),
});

export const adminArticleListSchema = z.array(adminArticleSummarySchema);

export const adminArticleSchema = z.object({
  id: z.number().int().min(1),
  slug: z.string().min(1),
  publishedOn: z.string(),
  isPublished: z.boolean(),
  coverPath,
  updatedAt: z.string(),
  texts: z
    .array(z.object({ language, title: z.string(), excerpt: z.string(), bodyHtml: z.string() }))
    .length(2),
});
