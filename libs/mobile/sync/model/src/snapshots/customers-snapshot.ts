import { z } from 'zod';

/** `GET /api/mobile/sync/customers` (KedrStore platform/004). Unknown fields are dropped. */
export const customersSnapshotSchema = z.object({
  version: z.string(),
  generatedAt: z.string(),
  customers: z.array(
    z.object({
      counterpartyId: z.string(),
      name: z.string(),
      phone: z.string().nullable(),
      email: z.string(),
      defaultPriceTypeId: z.number().int(),
      categoryPriceTypes: z.array(
        z.object({ categoryId: z.number().int(), priceTypeId: z.number().int() }),
      ),
      debt: z.number().nullable(),
      balance: z.number().nullable(),
    }),
  ),
});

export type CustomersSnapshot = z.infer<typeof customersSnapshotSchema>;
