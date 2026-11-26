import { z } from 'zod';

/** Runtime shape of one reviewed page; kinds and issues stay strings so a new one does not break the list. */
export const seoReviewItemSchema = z.object({
  kind: z.string(),
  id: z.number().int(),
  name: z.string(),
  language: z.string(),
  issues: z.array(z.string()),
});

export const seoReviewListSchema = z.array(seoReviewItemSchema);
