import { formatRequisitesCopy, getRequisitesDictionary } from '@site/content/model';
import { buildRequisitesBreadcrumbJsonLd } from '@site/content/seo';
import { RequisitesContent } from '@site/content/ui';
import { COMPANY_REQUISITES } from '@site/core/config';
import { JsonLd } from '@site/core/seo';
import { getCompanyContacts } from '@site/shared/company';

import type { RequisitesDetails } from '@site/content/model';
import type { Locale } from '@site/core/i18n';

/** Server composition of confirmed administration facts and the admin-edited sales phone. */
export async function RequisitesPage({ locale }: { locale: Locale }) {
  const contacts = await getCompanyContacts();
  const details: RequisitesDetails = { ...COMPANY_REQUISITES, phone: contacts.phone };
  const dictionary = getRequisitesDictionary(locale);
  const copyText = formatRequisitesCopy(details, dictionary.fields);

  return (
    <>
      <RequisitesContent dictionary={dictionary} details={details} copyText={copyText} />
      <JsonLd data={buildRequisitesBreadcrumbJsonLd(locale)} />
    </>
  );
}
