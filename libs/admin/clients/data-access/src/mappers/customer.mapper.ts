import { z } from 'zod';

import type { CustomerDetailResponse, CustomerPageResponse } from '../contracts/customer.contract';
import type { CustomerPage, CustomerDetail } from '@admin/clients/model';

const customerListItemSchema = z.object({
  counterpartyId: z.string().min(1).max(64),
  name: z.string().max(300),
  phone: z.string().max(50).nullable(),
});

const customerPageSchema = z.object({
  pagedInfo: z.object({
    pageNumber: z.number().int().min(1),
    pageSize: z.number().int().min(1).max(100),
    totalPages: z.number().int().nonnegative(),
    totalRecords: z.number().int().nonnegative(),
  }),
  value: z.array(customerListItemSchema),
});

const customerDetailSchema = customerListItemSchema.extend({
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

export function mapCustomerPage(response: unknown): CustomerPage {
  const parsed = customerPageSchema.parse(response) satisfies CustomerPageResponse;
  return {
    items: parsed.value.map(({ counterpartyId, name, phone }) => ({ counterpartyId, name, phone })),
    pageNumber: parsed.pagedInfo.pageNumber,
    pageSize: parsed.pagedInfo.pageSize,
    totalPages: parsed.pagedInfo.totalPages,
    totalRecords: parsed.pagedInfo.totalRecords,
  };
}

export function mapCustomerDetail(response: unknown): CustomerDetail {
  const parsed = customerDetailSchema.parse(response) satisfies CustomerDetailResponse;
  return {
    counterpartyId: parsed.counterpartyId,
    name: parsed.name,
    phone: parsed.phone,
    email: parsed.email,
    defaultPriceTypeId: parsed.defaultPriceTypeId,
    defaultPriceTypeName: parsed.defaultPriceTypeName,
    categoryPriceTypes: parsed.categoryPriceTypes.map(
      ({ categoryId, categoryName, priceTypeId, priceTypeName }) => ({
        categoryId,
        categoryName,
        priceTypeId,
        priceTypeName,
      }),
    ),
  };
}
