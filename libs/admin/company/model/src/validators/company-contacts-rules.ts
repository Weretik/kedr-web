import { companyContactsLimits } from '../entities/company-contacts';
import { normalizeUaPhone } from '../forms/company-contacts-draft';

import type { CompanyContactsDraft, CompanyContactsField } from '../forms/company-contacts-draft';

export type CompanyContactsErrors = Partial<Record<CompanyContactsField, string>>;

const phonePattern = /^\+380\d{9}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const httpsHost = (value: string): string | undefined => {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.hostname ? url.hostname.toLowerCase() : undefined;
  } catch {
    return undefined;
  }
};

const phone = (value: string) => {
  if (!value.trim()) return 'Вкажіть номер.';
  return phonePattern.test(normalizeUaPhone(value))
    ? undefined
    : 'Український номер, наприклад 068 713 50 49.';
};

const text = (value: string, max: number, missing: string) => {
  const trimmed = value.trim();
  if (!trimmed) return missing;
  return trimmed.length > max ? `Не більше ${max} символів.` : undefined;
};

const link = (value: string, missing: string, hosts?: readonly string[]) => {
  const tooLong = text(value, companyContactsLimits.url, missing);
  if (tooLong) return tooLong;
  const host = httpsHost(value.trim());
  if (!host) return 'Посилання має починатися з https://';
  return hosts && !hosts.includes(host) ? 'Посилання на Telegram: https://t.me/…' : undefined;
};

/** Field errors, or `undefined` when the contacts can be saved. Mirrors the backend rules. */
export function validateCompanyContactsDraft(
  draft: CompanyContactsDraft,
): CompanyContactsErrors | undefined {
  const emailError = text(draft.email, companyContactsLimits.email, 'Вкажіть email.');
  const errors: CompanyContactsErrors = {
    salesPhone: phone(draft.salesPhone),
    viberPhone: phone(draft.viberPhone),
    email: emailError ?? (emailPattern.test(draft.email.trim()) ? undefined : 'Перевірте email.'),
    telegramUrl: link(draft.telegramUrl, 'Вкажіть посилання на Telegram.', ['t.me', 'telegram.me']),
    mapUrl: link(draft.mapUrl, 'Вкажіть посилання на карту.'),
    cityUk: text(draft.cityUk, companyContactsLimits.city, 'Вкажіть місто.'),
    cityRu: text(draft.cityRu, companyContactsLimits.city, 'Вкажіть місто.'),
  };
  return Object.values(errors).some(Boolean) ? errors : undefined;
}
