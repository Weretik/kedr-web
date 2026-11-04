import type { CompanyRequisites } from '../entities/company-requisites';

/** Editable fields of the requisites, as typed by the user. */
export type CompanyRequisitesDraft = Omit<CompanyRequisites, 'updatedAt'>;

export const companyRequisitesFields = [
  'legalName',
  'code',
  'registrationExtractNumber',
  'iban',
  'bankName',
  'bankCode',
] as const satisfies readonly (keyof CompanyRequisitesDraft)[];

export type CompanyRequisitesField = (typeof companyRequisitesFields)[number];

/** Ukrainian names of the fields, for the form and the change history. */
export const companyRequisitesFieldLabels: Record<CompanyRequisitesField, string> = {
  legalName: 'Найменування',
  code: 'Код ЄДРПОУ / РНОКПП',
  registrationExtractNumber: 'Номер витягу',
  iban: 'IBAN',
  bankName: 'Банк',
  bankCode: 'МФО',
};

export function requisitesToDraft(requisites: CompanyRequisites): CompanyRequisitesDraft {
  return Object.fromEntries(
    companyRequisitesFields.map((field) => [field, requisites[field]]),
  ) as CompanyRequisitesDraft;
}

export function isSameRequisitesDraft(
  a: CompanyRequisitesDraft,
  b: CompanyRequisitesDraft,
): boolean {
  return companyRequisitesFields.every((field) => a[field] === b[field]);
}

/** The IBAN as the backend stores it: no spaces, upper case. */
export function normalizeIban(input: string): string {
  return input.replace(/\s/g, '').toUpperCase();
}

/** The IBAN in groups of four for reading (`UA30 3052 …`). */
export function formatIban(iban: string): string {
  return normalizeIban(iban).replace(/(.{4})(?=.)/g, '$1 ');
}
