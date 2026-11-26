import { WEEKDAYS } from '@site/core/config';

import type { components } from '@shared/api-contracts';
import type { CompanyStore, StoreDay, StoreHours } from '@site/core/config';

type CompanyStoreDto = components['schemas']['CompanyStoreDto'];

const text = (value: string | null | undefined) => value?.trim() || null;

const hours = (
  days: readonly StoreDay[],
  opens: string | null | undefined,
  closes: string | null | undefined,
): StoreHours[] => {
  const from = text(opens);
  const to = text(closes);
  return from && to ? [{ days, opens: from, closes: to }] : [];
};

/**
 * The shop as the site marks it up, or `null` while the admin has not filled in the street. A Russian field
 * left empty shows the Ukrainian one; a day without hours is a day off.
 */
export function mapCompanyStore(dto: CompanyStoreDto | null | undefined): CompanyStore | null {
  const streetUk = text(dto?.streetAddressUk);
  if (!dto || !streetUk) return null;
  const regionUk = text(dto.regionUk);
  return {
    name: text(dto.storeName),
    streetAddress: { uk: streetUk, ru: text(dto.streetAddressRu) ?? streetUk },
    region: regionUk ? { uk: regionUk, ru: text(dto.regionRu) ?? regionUk } : null,
    postalCode: text(dto.postalCode),
    hours: [
      ...hours(WEEKDAYS, dto.weekdaysOpens, dto.weekdaysCloses),
      ...hours(['Saturday'], dto.saturdayOpens, dto.saturdayCloses),
      ...hours(['Sunday'], dto.sundayOpens, dto.sundayCloses),
    ],
  };
}
