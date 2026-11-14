export {
  customerDraftPageSchema,
  customerDraftSchema,
  customerOrderPageSchema,
  customerOrderSchema,
  type CustomerActivity,
  type CustomerDraft,
  type CustomerOrder,
} from './entities/customer-activity';
export type { Customer, CustomerDetails, CustomerPriceRule } from './entities/customer';
export { formatDate, formatHryvnias, formatKopecks } from '@mobile/shared/model';
export {
  compareNames,
  groupByLetter,
  sortCustomersByName,
  matchesCustomer,
  normalizeText,
  searchCustomers,
  type CustomerSection,
} from './queries/customer-search';
export { maxRecentCustomers, pushRecent } from './queries/recent-customers';
export { activityNote } from './mappers/activity-note';
export {
  customerListSections,
  flattenSections,
  letterSections,
  recentCustomers,
  type CustomerListItem,
  type CustomerListSection,
} from './queries/customer-list-items';
