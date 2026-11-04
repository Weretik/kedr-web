import { z } from 'zod';

/** Runtime shape of document responses; mappers receive data that passed these schemas. */
const kind = z.enum(['public-offer', 'privacy-policy', 'returns-policy', 'delivery-payment']);

export const legalDocumentVersionSummarySchema = z.object({
  id: z.number().int().min(1),
  status: z.enum(['draft', 'published', 'archived']),
  number: z.number().int().min(1).nullable(),
  effectiveFrom: z.string().nullable(),
  updatedAt: z.string(),
  updatedBy: z.string(),
  publishedAt: z.string().nullable(),
  publishedBy: z.string().nullable(),
});

export const legalDocumentVersionListSchema = z.array(legalDocumentVersionSummarySchema);

export const legalDocumentOverviewListSchema = z.array(
  z.object({
    kind,
    published: legalDocumentVersionSummarySchema.nullable(),
    draft: legalDocumentVersionSummarySchema.nullable(),
  }),
);

export const legalDocumentVersionSchema = legalDocumentVersionSummarySchema.extend({
  kind,
  texts: z
    .array(z.object({ language: z.enum(['uk', 'ru']), title: z.string(), bodyHtml: z.string() }))
    .length(2),
});
