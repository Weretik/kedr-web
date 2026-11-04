export { companyContactsLimits } from './entities/company-contacts';
export type { CompanyContacts } from './entities/company-contacts';
export {
  companyContactsFields,
  contactsToDraft,
  isSameContactsDraft,
  normalizeUaPhone,
} from './forms/company-contacts-draft';
export type { CompanyContactsDraft, CompanyContactsField } from './forms/company-contacts-draft';
export { validateCompanyContactsDraft } from './validators/company-contacts-rules';
export type { CompanyContactsErrors } from './validators/company-contacts-rules';
