import { z } from 'zod';

/** Runtime shape of the contacts response; the mapper receives data that passed this schema. */
export const companyContactsSchema = z.object({
  salesPhone: z.string(),
  email: z.string(),
  telegramUrl: z.string(),
  viberPhone: z.string(),
  mapUrl: z.string(),
  cityUk: z.string(),
  cityRu: z.string(),
  updatedAt: z.string(),
  updatedBy: z.string().nullish(),
});
