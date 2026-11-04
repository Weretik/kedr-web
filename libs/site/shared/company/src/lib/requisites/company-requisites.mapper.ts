import type { components } from '@shared/api-contracts';
import type { CompanyRequisites } from '@site/core/config';

type CompanyRequisitesDto = components['schemas']['CompanyRequisites'];

/** API row to the site model; the IBAN comes without spaces and is shown as is. */
export function mapCompanyRequisites(dto: CompanyRequisitesDto): CompanyRequisites {
  return {
    legalName: dto.legalName,
    code: dto.code,
    registrationExtractNumber: dto.registrationExtractNumber,
    iban: dto.iban,
    bankName: dto.bankName,
    bankCode: dto.bankCode,
  };
}
