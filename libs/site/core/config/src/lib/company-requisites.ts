/** Payment requisites the site shows; Admins edit them, the site loads them from the API. */
export type CompanyRequisites = {
  readonly legalName: string;
  readonly code: string;
  readonly registrationExtractNumber: string;
  readonly iban: string;
  readonly bankName: string;
  readonly bankCode: string;
};

/**
 * The last known requisites (owner-confirmed 2026-11-03), used when the API cannot be reached so the
 * requisites page still renders. Keep them equal to the row the admin saved.
 */
export const FALLBACK_COMPANY_REQUISITES: CompanyRequisites = {
  legalName: 'ФОП Овчинников Максим Володимирович',
  code: '2689400771',
  registrationExtractNumber: '24800170000032534',
  iban: 'UA303052990000026007025905216',
  bankName: 'ПриватБанк',
  bankCode: '305299',
};
