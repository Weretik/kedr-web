import { z } from 'zod';

const text = z
  .string()
  .nullish()
  .transform((value) => value ?? '');

/** The shop; the backend sends `null` for an empty field, the admin edits ''. */
export const companyStoreSchema = z.object({
  storeName: text,
  streetAddressUk: text,
  streetAddressRu: text,
  regionUk: text,
  regionRu: text,
  postalCode: text,
  weekdaysOpens: text,
  weekdaysCloses: text,
  saturdayOpens: text,
  saturdayCloses: text,
  sundayOpens: text,
  sundayCloses: text,
});

/** Runtime shape of the contacts response; the mapper receives data that passed this schema. */
export const companyContactsSchema = z.object({
  salesPhone: z.string(),
  email: z.string(),
  telegramUrl: z.string(),
  viberPhone: z.string(),
  mapUrl: z.string(),
  cityUk: z.string(),
  cityRu: z.string(),
  store: companyStoreSchema,
  updatedAt: z.string(),
  updatedBy: z.string().nullish(),
});
