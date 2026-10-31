import { z } from 'zod';

/** Runtime shape of customer responses; mappers receive data that passed these schemas. */
const customerListItemSchema = z.object({
  counterpartyId: z.string().min(1).max(64),
  name: z.string().max(300),
  phone: z.string().max(50).nullable(),
});

export const customerPageSchema = z.object({
  pagedInfo: z.object({
    pageNumber: z.number().int().min(1),
    pageSize: z.number().int().min(1).max(100),
    totalPages: z.number().int().nonnegative(),
    totalRecords: z.number().int().nonnegative(),
  }),
  value: z.array(customerListItemSchema),
});

export const customerDetailSchema = customerListItemSchema.extend({
  email: z.string().max(320),
  defaultPriceTypeId: z.number().int().min(1),
  defaultPriceTypeName: z.string().nullable(),
  categoryPriceTypes: z.array(
    z.object({
      categoryId: z.number().int().min(1),
      categoryName: z.string().nullable(),
      priceTypeId: z.number().int().min(1),
      priceTypeName: z.string().nullable(),
    }),
  ),
});
