import type { operations } from '@shared/api-contracts';

/** Admin reads the page and its rows; the other result fields of the API wrapper are not used. */
export type SiteOrderPageResponse = Pick<
  operations['getAdminQuickOrders']['responses'][200]['content']['application/json'],
  'pagedInfo' | 'value'
>;
export type SiteOrderDetailResponse =
  operations['getAdminQuickOrderById']['responses'][200]['content']['application/json'];
export type SiteOrderPageParams = NonNullable<
  operations['getAdminQuickOrders']['parameters']['query']
>;
