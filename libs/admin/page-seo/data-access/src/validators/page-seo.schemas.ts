import { z } from 'zod';

const text = z.string().nullable();

/** Runtime shape of one site page in the admin list; mappers receive data that passed this schema. */
export const adminPageSeoSchema = z.object({
  page: z.string(),
  titleUk: text,
  titleRu: text,
  descriptionUk: text,
  descriptionRu: text,
  updatedAt: z.string().nullable(),
  updatedBy: z.string().nullable(),
});

export const adminPageSeoListSchema = z.array(adminPageSeoSchema);
