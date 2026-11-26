import { companyStoreFields, normalizeUaPhone } from '@admin/company/model';

import { companyContactsSchema } from '../validators/company-contacts.schemas';

import type { SaveCompanyContactsBody } from '../contracts/company-contacts.contract';
import type { CompanyContacts, CompanyContactsDraft } from '@admin/company/model';

export function mapCompanyContacts(response: unknown): CompanyContacts {
  const contacts = companyContactsSchema.parse(response);
  return { ...contacts, updatedBy: contacts.updatedBy ?? null };
}

const toStore = (draft: CompanyContactsDraft): NonNullable<SaveCompanyContactsBody['store']> =>
  Object.fromEntries(
    companyStoreFields.map((field) => [field, draft[field].trim() || null]),
  ) as NonNullable<SaveCompanyContactsBody['store']>;

/** Trimmed values; phones in `+380…` form whatever way they were typed; an empty shop field is `null`. */
export function toSaveCompanyContactsBody(draft: CompanyContactsDraft): SaveCompanyContactsBody {
  return {
    salesPhone: normalizeUaPhone(draft.salesPhone),
    viberPhone: normalizeUaPhone(draft.viberPhone),
    email: draft.email.trim(),
    telegramUrl: draft.telegramUrl.trim(),
    mapUrl: draft.mapUrl.trim(),
    cityUk: draft.cityUk.trim(),
    cityRu: draft.cityRu.trim(),
    store: toStore(draft),
  };
}
