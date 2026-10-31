import { customerDetailSchema, customerPageSchema } from '../validators/customer.schemas';

import type { CustomerDetailResponse, CustomerPageResponse } from '../contracts/customer.contract';
import type { CustomerPage, CustomerDetail } from '@admin/clients/model';

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
