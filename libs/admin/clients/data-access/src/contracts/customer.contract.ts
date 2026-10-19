import type { operations } from '@shared/api-contracts';

export type CustomerPageResponse =
  operations['getAdminCustomers']['responses'][200]['content']['application/json'];
export type CustomerDetailResponse =
  operations['getAdminCustomerById']['responses'][200]['content']['application/json'];
export type CustomerPageParams = NonNullable<
  operations['getAdminCustomers']['parameters']['query']
>;
