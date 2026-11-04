/** Payment requisites the public site shows; one record, edited by Admins only. */
export interface CompanyRequisites {
  legalName: string;
  code: string;
  registrationExtractNumber: string;
  iban: string;
  bankName: string;
  bankCode: string;
  updatedAt: string;
}

/** One changed field of a saved change: its API name and both values. */
export interface RequisitesFieldChange {
  field: string;
  oldValue: string;
  newValue: string;
}

/** One saved change of the requisites: when, who, and what changed. */
export interface CompanyRequisitesChange {
  id: number;
  changedAt: string;
  changedBy: string;
  changes: RequisitesFieldChange[];
}

/** Field limits shared with the backend. */
export const companyRequisitesLimits = {
  legalName: 200,
  bankName: 120,
  extractNumber: 30,
} as const;
