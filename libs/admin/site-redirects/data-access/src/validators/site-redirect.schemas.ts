import { z } from 'zod';

/** Runtime shape of one redirect; mappers receive data that passed this schema. */
export const siteRedirectSchema = z.object({
  id: z.number().int().positive(),
  from: z.string(),
  to: z.string(),
  updatedAt: z.string(),
  updatedBy: z.string(),
  version: z.number().int().nonnegative().default(0),
});

export const siteRedirectPageSchema = z.object({
  items: z.array(siteRedirectSchema),
  totalCount: z.number().int().nonnegative(),
});
