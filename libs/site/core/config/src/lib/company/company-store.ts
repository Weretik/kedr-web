/** schema.org days of the week, as `openingHoursSpecification` names them. */
export type StoreDay =
  'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

/** Days with the same hours; times are `HH:mm`. Days that are not listed are days off. */
export type StoreHours = { days: readonly StoreDay[]; opens: string; closes: string };

/**
 * The shop customers can visit, from «Контакти» in the admin; marked up as a local business. `null` on the
 * contacts while the admin has not filled in the street.
 */
export type CompanyStore = {
  /** The name Google Maps shows; `null` uses the brand. */
  name: string | null;
  streetAddress: { uk: string; ru: string };
  region: { uk: string; ru: string } | null;
  postalCode: string | null;
  hours: StoreHours[];
};

export const WEEKDAYS: readonly StoreDay[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
];

/** The shop the owner gave on 26.11.2026; the API row the admin saves replaces it. */
export const FALLBACK_COMPANY_STORE: CompanyStore = {
  name: 'Крамниця Дверна фурнітура CLASS',
  streetAddress: { uk: 'вул. Ахієзерів, 46', ru: 'ул. Ахиезеров, 46' },
  region: { uk: 'Харківська обл.', ru: 'Харьковская обл.' },
  postalCode: '61038',
  hours: [{ days: WEEKDAYS, opens: '09:00', closes: '16:00' }],
};
