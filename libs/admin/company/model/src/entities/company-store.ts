/**
 * The shop customers can visit, marked up for search engines as a local business. Every field is optional;
 * empty text is ''. Times are `HH:mm`; a day with no hours is a day off. A type, not an interface, so the
 * flat contacts draft stays a plain string record.
 */
export type CompanyStore = {
  storeName: string;
  streetAddressUk: string;
  streetAddressRu: string;
  regionUk: string;
  regionRu: string;
  postalCode: string;
  weekdaysOpens: string;
  weekdaysCloses: string;
  saturdayOpens: string;
  saturdayCloses: string;
  sundayOpens: string;
  sundayCloses: string;
};

export const companyStoreFields = [
  'storeName',
  'streetAddressUk',
  'streetAddressRu',
  'regionUk',
  'regionRu',
  'postalCode',
  'weekdaysOpens',
  'weekdaysCloses',
  'saturdayOpens',
  'saturdayCloses',
  'sundayOpens',
  'sundayCloses',
] as const satisfies readonly (keyof CompanyStore)[];

/** The three day groups whose hours the shop keeps, each as its opening and closing field. */
export const companyStoreDays = [
  { opens: 'weekdaysOpens', closes: 'weekdaysCloses' },
  { opens: 'saturdayOpens', closes: 'saturdayCloses' },
  { opens: 'sundayOpens', closes: 'sundayCloses' },
] as const satisfies readonly { opens: keyof CompanyStore; closes: keyof CompanyStore }[];

/** Field limits shared with the backend. */
export const companyStoreLimits = { name: 120, street: 200, region: 80 } as const;
