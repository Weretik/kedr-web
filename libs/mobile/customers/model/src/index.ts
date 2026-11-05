export {
  customerDraftPageSchema,
  customerDraftSchema,
  customerOrderPageSchema,
  customerOrderSchema,
  type CustomerActivity,
  type CustomerDraft,
  type CustomerOrder,
} from './activity/customer-activity';
export type { Customer, CustomerDetails, CustomerPriceRule } from './entities/customer';
export { formatDate, formatHryvnias, formatKopecks } from '@mobile/shared/model';
export {
  compareNames,
  groupByLetter,
  matchesCustomer,
  normalizeText,
  searchCustomers,
  type CustomerSection,
} from './search/customer-search';
export { maxRecentCustomers, pushRecent } from './search/recent-customers';
