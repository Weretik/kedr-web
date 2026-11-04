/** Sales contacts the public site shows; one record for the whole site. */
export interface CompanyContacts {
  salesPhone: string;
  email: string;
  telegramUrl: string;
  viberPhone: string;
  mapUrl: string;
  cityUk: string;
  cityRu: string;
  updatedAt: string;
}

/** Field limits shared with the backend. */
export const companyContactsLimits = { email: 120, url: 500, city: 80 } as const;
