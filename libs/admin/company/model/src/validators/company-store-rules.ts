import { companyStoreDays, companyStoreLimits } from '../entities/company-store';

import type { CompanyStore } from '../entities/company-store';

export type CompanyStoreErrors = Partial<Record<keyof CompanyStore, string>>;

const timePattern = /^([01]?\d|2[0-3]):[0-5]\d$/;

const minutes = (value: string) => {
  const [hours, mins] = value.trim().split(':').map(Number);
  return hours * 60 + mins;
};

const optionalText = (value: string, max: number) =>
  value.trim().length > max ? `Не більше ${max} символів.` : undefined;

/** Errors of one day group: both times or neither, valid `HH:mm`, opening before closing. */
function dayErrors(store: CompanyStore, opens: keyof CompanyStore, closes: keyof CompanyStore) {
  const from = store[opens].trim();
  const to = store[closes].trim();
  if (!from && !to) return {};
  if (!timePattern.test(from)) return { [opens]: 'Вкажіть час відкриття, наприклад 9:00.' };
  if (!timePattern.test(to)) return { [closes]: 'Вкажіть час закриття, наприклад 16:00.' };
  return minutes(to) > minutes(from) ? {} : { [closes]: 'Магазин має закриватися пізніше.' };
}

/** Errors of the shop fields; an empty shop is valid. Mirrors the backend rules. */
export function validateCompanyStore(store: CompanyStore): CompanyStoreErrors {
  const postal = store.postalCode.trim();
  return {
    storeName: optionalText(store.storeName, companyStoreLimits.name),
    streetAddressUk: optionalText(store.streetAddressUk, companyStoreLimits.street),
    streetAddressRu: optionalText(store.streetAddressRu, companyStoreLimits.street),
    regionUk: optionalText(store.regionUk, companyStoreLimits.region),
    regionRu: optionalText(store.regionRu, companyStoreLimits.region),
    postalCode: postal && !/^\d{5}$/.test(postal) ? 'П’ять цифр, наприклад 61038.' : undefined,
    ...Object.assign({}, ...companyStoreDays.map((day) => dayErrors(store, day.opens, day.closes))),
  };
}
