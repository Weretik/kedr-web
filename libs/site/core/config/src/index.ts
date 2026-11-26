export { COMPANY } from './lib/company/company';
export { TITLE_MAX_LENGTH, pageTitle, withoutBrand } from './lib/company/brand-title';
export { DEFAULT_OG_IMAGE } from './lib/company/share-image';
export {
  FALLBACK_COMPANY_CONTACTS,
  formatUaPhone,
  viberChatLink,
} from './lib/company/company-contacts';
export type { CompanyContacts } from './lib/company/company-contacts';
export { FALLBACK_COMPANY_STORE, WEEKDAYS } from './lib/company/company-store';
export type { CompanyStore, StoreDay, StoreHours } from './lib/company/company-store';
export { createSiteConfig, siteConfig } from './lib/site/site-config';
export type { SiteConfig, SiteEnvironment } from './lib/site/site-config';
export { FALLBACK_COMPANY_REQUISITES } from './lib/company/company-requisites';
export type { CompanyRequisites } from './lib/company/company-requisites';
export { createRevalidationConfig } from './lib/site/revalidation-config';
export type { RevalidationConfig } from './lib/site/revalidation-config';
