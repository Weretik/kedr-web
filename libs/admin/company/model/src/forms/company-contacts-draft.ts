import { companyStoreFields } from '../entities/company-store';

import type { CompanyContacts } from '../entities/company-contacts';
import type { CompanyStore } from '../entities/company-store';

/** Editable fields of the contacts and of the shop, side by side, as typed by the user. */
export type CompanyContactsDraft = Omit<CompanyContacts, 'updatedAt' | 'updatedBy' | 'store'> &
  CompanyStore;

const contactFields = [
  'salesPhone',
  'viberPhone',
  'email',
  'telegramUrl',
  'mapUrl',
  'cityUk',
  'cityRu',
] as const satisfies readonly (keyof CompanyContactsDraft)[];

export const companyContactsFields = [...contactFields, ...companyStoreFields] as const;

export type CompanyContactsField = (typeof companyContactsFields)[number];

export function contactsToDraft(contacts: CompanyContacts): CompanyContactsDraft {
  const values: CompanyContacts & CompanyStore = { ...contacts, ...contacts.store };
  return Object.fromEntries(
    companyContactsFields.map((field) => [field, values[field]]),
  ) as CompanyContactsDraft;
}

export function isSameContactsDraft(a: CompanyContactsDraft, b: CompanyContactsDraft): boolean {
  return companyContactsFields.every((field) => a[field] === b[field]);
}

/**
 * A Ukrainian number in the `+380XXXXXXXXX` form the site needs. Accepts the usual ways of typing it
 * (`068 713 50 49`, `(068) 713-50-49`, `380687135049`); anything else is returned trimmed, for the validator.
 */
export function normalizeUaPhone(input: string): string {
  const trimmed = input.trim();
  const digits = trimmed.replace(/[\s()-]/g, '');
  if (/^0\d{9}$/.test(digits)) return `+38${digits}`;
  if (/^380\d{9}$/.test(digits)) return `+${digits}`;
  if (/^\+380\d{9}$/.test(digits)) return digits;
  return trimmed;
}
