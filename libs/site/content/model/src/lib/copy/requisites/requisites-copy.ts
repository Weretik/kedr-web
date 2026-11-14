import type { RequisitesFieldLabels, RequisitesValues } from './requisites-types';

/** Six labelled lines; the separate IBAN-only action uses values.iban directly. */
export function formatRequisitesCopy(
  values: RequisitesValues,
  labels: RequisitesFieldLabels,
): string {
  return [
    `${labels.legalName}: ${values.legalName}`,
    `${labels.code}: ${values.code}`,
    `${labels.registrationExtractNumber}: № ${values.registrationExtractNumber}`,
    `${labels.iban}: ${values.iban}`,
    `${labels.bankName}: ${values.bankName}`,
    `${labels.bankCode}: ${values.bankCode}`,
  ].join('\n');
}
