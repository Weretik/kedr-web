import type { operations } from '@shared/api-contracts';

/** Admin reads the page and its rows; the other result fields of the API wrapper are not used. */
export type CustomerPageResponse = Pick<
  operations['getAdminCustomers']['responses'][200]['content']['application/json'],
  'pagedInfo' | 'value'
>;
export type CustomerDetailResponse =
  operations['getAdminCustomerById']['responses'][200]['content']['application/json'];
export type CustomerPageParams = NonNullable<
  operations['getAdminCustomers']['parameters']['query']
>;
