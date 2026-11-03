import { formatRequisitesCopy, getRequisitesDictionary } from '@site/content/model';
import { buildRequisitesBreadcrumbJsonLd } from '@site/content/seo';
import { RequisitesContent } from '@site/content/ui';
import { COMPANY, COMPANY_REQUISITES } from '@site/core/config';
import { JsonLd } from '@site/core/seo';

import type { RequisitesDetails } from '@site/content/model';
import type { Locale } from '@site/core/i18n';

/** Server composition of confirmed administration facts and the existing site contact. */
export function RequisitesPage({ locale }: { locale: Locale }) {
  const details: RequisitesDetails = { ...COMPANY_REQUISITES, phone: COMPANY.phone };
  const dictionary = getRequisitesDictionary(locale);
  const copyText = formatRequisitesCopy(details, dictionary.fields);

  return (
    <>
      <RequisitesContent dictionary={dictionary} details={details} copyText={copyText} />
      <JsonLd data={buildRequisitesBreadcrumbJsonLd(locale)} />
    </>
  );
}
