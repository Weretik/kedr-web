import { normalizeIban } from '@admin/company/model';

import {
  companyRequisitesHistorySchema,
  companyRequisitesSchema,
} from '../validators/company-requisites.schemas';

import type { SaveCompanyRequisitesBody } from '../contracts/company-requisites.contract';
import type {
  CompanyRequisites,
  CompanyRequisitesChange,
  CompanyRequisitesDraft,
} from '@admin/company/model';

export function mapCompanyRequisites(response: unknown): CompanyRequisites {
  return companyRequisitesSchema.parse(response);
}

export function mapCompanyRequisitesHistory(response: unknown): CompanyRequisitesChange[] {
  return companyRequisitesHistorySchema.parse(response);
}

/** Trimmed values; the IBAN without spaces whatever way it was typed. */
export function toSaveCompanyRequisitesBody(
  draft: CompanyRequisitesDraft,
): SaveCompanyRequisitesBody {
  return {
    legalName: draft.legalName.trim(),
    code: draft.code.trim(),
    registrationExtractNumber: draft.registrationExtractNumber.trim(),
    iban: normalizeIban(draft.iban),
    bankName: draft.bankName.trim(),
    bankCode: draft.bankCode.trim(),
  };
}
