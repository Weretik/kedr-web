import { z } from 'zod';

/** Runtime shape of the admin home blocks; mappers receive data that passed this schema. */
export const adminHomeBlocksSchema = z.object({
  faq: z.array(
    z.object({
      id: z.number().int().min(1),
      position: z.number().int(),
      questionUk: z.string(),
      questionRu: z.string(),
      answerUk: z.string(),
      answerRu: z.string(),
      updatedAt: z.string(),
    }),
  ),
  brands: z.array(
    z.object({
      id: z.number().int().min(1),
      position: z.number().int(),
      name: z.string(),
      logoMediaFileId: z.number().int(),
      logoUrl: z.string().nullable(),
      logoFileName: z.string().nullable(),
      logoMissing: z.boolean(),
      updatedAt: z.string(),
    }),
  ),
});
