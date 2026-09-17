import { z } from 'zod';

import type { Customer } from '@mobile/customers/model';
import type { operations } from '@shared/api-contracts';

type CustomerPageDto =
  operations['getAdminCustomers']['responses'][200]['content']['application/json'];

const customerPageSchema = z.object({
  pagedInfo: z.object({
    pageNumber: z.number().int().min(1),
    pageSize: z.number().int().min(1).max(100),
    totalPages: z.number().int().nonnegative(),
    totalRecords: z.number().int().nonnegative(),
  }),
  value: z.array(
    z.object({
      counterpartyId: z.string().min(1).max(64),
      name: z.string().min(1).max(300),
      phone: z.string().max(50).nullable(),
    }),
  ),
});

export interface CustomerPage {
  customers: Customer[];
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
}

export function parseCustomerPage(response: unknown): CustomerPage {
  const parsed = customerPageSchema.parse(response) satisfies CustomerPageDto;

  return {
    customers: parsed.value.map(({ counterpartyId, name, phone }) => ({
      counterpartyId,
      name,
      phone,
    })),
    pageNumber: parsed.pagedInfo.pageNumber,
    pageSize: parsed.pagedInfo.pageSize,
    totalPages: parsed.pagedInfo.totalPages,
    totalRecords: parsed.pagedInfo.totalRecords,
  };
}
