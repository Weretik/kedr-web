import { z } from 'zod';

/** Runtime shape of the requisites response; the mapper receives data that passed this schema. */
export const companyRequisitesSchema = z.object({
  legalName: z.string(),
  code: z.string(),
  registrationExtractNumber: z.string(),
  iban: z.string(),
  bankName: z.string(),
  bankCode: z.string(),
  updatedAt: z.string(),
});

/** Runtime shape of the change history, newest first. */
export const companyRequisitesHistorySchema = z.array(
  z.object({
    id: z.number(),
    changedAt: z.string(),
    changedBy: z.string(),
    changes: z.array(z.object({ field: z.string(), oldValue: z.string(), newValue: z.string() })),
  }),
);
