import { companyRequisitesLimits } from '../entities/company-requisites';
import { normalizeIban } from '../forms/company-requisites-draft';

import type {
  CompanyRequisitesDraft,
  CompanyRequisitesField,
} from '../forms/company-requisites-draft';

export type CompanyRequisitesErrors = Partial<Record<CompanyRequisitesField, string>>;

const ibanPattern = /^UA\d{27}$/;

/** ISO 13616 mod-97 check: the account number moved behind the country, letters as numbers. */
export function hasValidIbanChecksum(iban: string): boolean {
  const rearranged = iban.slice(4) + iban.slice(0, 4);
  let remainder = 0;
  for (const char of rearranged) {
    const value = /\d/.test(char) ? char : String(char.charCodeAt(0) - 55);
    for (const digit of value) remainder = (remainder * 10 + Number(digit)) % 97;
  }
  return remainder === 1;
}

/** The МФО is digits 5–10 of a Ukrainian IBAN. */
export function bankCodeFromIban(iban: string): string | undefined {
  const normalized = normalizeIban(iban);
  return ibanPattern.test(normalized) ? normalized.slice(4, 10) : undefined;
}

const text = (value: string, max: number, missing: string) => {
  const trimmed = value.trim();
  if (!trimmed) return missing;
  return trimmed.length > max ? `Не більше ${max} символів.` : undefined;
};

const code = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return 'Вкажіть код.';
  return /^(\d{8}|\d{10})$/.test(trimmed) ? undefined : 'ЄДРПОУ — 8 цифр, РНОКПП — 10 цифр.';
};

const extract = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return 'Вкажіть номер витягу.';
  return new RegExp(`^\\d{1,${companyRequisitesLimits.extractNumber}}$`).test(trimmed)
    ? undefined
    : `Лише цифри, не більше ${companyRequisitesLimits.extractNumber}.`;
};

const iban = (value: string) => {
  const normalized = normalizeIban(value);
  if (!normalized) return 'Вкажіть IBAN.';
  if (!ibanPattern.test(normalized)) return 'UA і 27 цифр, наприклад UA30 3052 9900 …';
  return hasValidIbanChecksum(normalized)
    ? undefined
    : 'Контрольні цифри не сходяться. Перевірте, чи немає помилки.';
};

const bankCode = (value: string, ibanValue: string) => {
  const trimmed = value.trim();
  if (!trimmed) return 'Вкажіть МФО.';
  if (!/^\d{6}$/.test(trimmed)) return 'МФО — 6 цифр.';
  const fromIban = bankCodeFromIban(ibanValue);
  return fromIban && fromIban !== trimmed ? `У цьому IBAN МФО ${fromIban}.` : undefined;
};

/** Field errors, or `undefined` when the requisites can be saved. Mirrors the backend rules. */
export function validateCompanyRequisitesDraft(
  draft: CompanyRequisitesDraft,
): CompanyRequisitesErrors | undefined {
  const ibanError = iban(draft.iban);
  const errors: CompanyRequisitesErrors = {
    legalName: text(draft.legalName, companyRequisitesLimits.legalName, 'Вкажіть найменування.'),
    code: code(draft.code),
    registrationExtractNumber: extract(draft.registrationExtractNumber),
    iban: ibanError,
    bankName: text(draft.bankName, companyRequisitesLimits.bankName, 'Вкажіть банк.'),
    bankCode: bankCode(draft.bankCode, ibanError ? '' : draft.iban),
  };
  return Object.values(errors).some(Boolean) ? errors : undefined;
}
