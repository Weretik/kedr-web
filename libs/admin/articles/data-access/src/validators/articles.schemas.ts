import { z } from 'zod';

/** Runtime shape of article responses; mappers receive data that passed these schemas. */
const language = z.enum(['uk', 'ru']);
const coverPath = z.string().startsWith('/').nullable();
const coverUrl = z.string().nullish();

export const adminArticleSummarySchema = z.object({
  id: z.number().int().min(1),
  slug: z.string().min(1),
  title: z.string(),
  publishedOn: z.string(),
  isPublished: z.boolean(),
  coverPath,
  coverUrl,
  updatedAt: z.string(),
  updatedBy: z.string().nullish(),
});

export const adminArticleListSchema = z.array(adminArticleSummarySchema);

export const adminArticleSchema = z.object({
  id: z.number().int().min(1),
  slug: z.string().min(1),
  publishedOn: z.string(),
  isPublished: z.boolean(),
  coverPath,
  coverUrl,
  coverMediaFileId: z.number().int().nullish(),
  updatedAt: z.string(),
  updatedBy: z.string().nullish(),
  texts: z
    .array(z.object({ language, title: z.string(), excerpt: z.string(), bodyHtml: z.string() }))
    .length(2),
});

/** Answer of the cover upload: the picture is in the media library, not yet on any article. */
export const articleCoverUploadSchema = z.object({
  mediaFileId: z.number().int().min(1),
  url: z.string().min(1),
});
