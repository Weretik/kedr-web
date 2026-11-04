import { normalizeUaPhone } from '@admin/company/model';

import { companyContactsSchema } from '../validators/company-contacts.schemas';

import type { SaveCompanyContactsBody } from '../contracts/company-contacts.contract';
import type { CompanyContacts, CompanyContactsDraft } from '@admin/company/model';

export function mapCompanyContacts(response: unknown): CompanyContacts {
  const contacts = companyContactsSchema.parse(response);
  return { ...contacts, updatedBy: contacts.updatedBy ?? null };
}

/** Trimmed values; phones in `+380…` form whatever way they were typed. */
export function toSaveCompanyContactsBody(draft: CompanyContactsDraft): SaveCompanyContactsBody {
  return {
    salesPhone: normalizeUaPhone(draft.salesPhone),
    viberPhone: normalizeUaPhone(draft.viberPhone),
    email: draft.email.trim(),
    telegramUrl: draft.telegramUrl.trim(),
    mapUrl: draft.mapUrl.trim(),
    cityUk: draft.cityUk.trim(),
    cityRu: draft.cityRu.trim(),
  };
}
