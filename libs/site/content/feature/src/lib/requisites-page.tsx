import { formatRequisitesCopy, getRequisitesDictionary } from '@site/content/model';
import { buildRequisitesBreadcrumbJsonLd } from '@site/content/seo';
import { RequisitesContent } from '@site/content/ui';
import { JsonLd } from '@site/core/seo';
import { getCompanyContacts, getCompanyRequisites } from '@site/shared/company';

import type { RequisitesDetails } from '@site/content/model';
import type { Locale } from '@site/core/i18n';

/** Server composition of the admin-edited requisites and sales phone. */
export async function RequisitesPage({ locale }: { locale: Locale }) {
  const [requisites, contacts] = await Promise.all([getCompanyRequisites(), getCompanyContacts()]);
  const details: RequisitesDetails = { ...requisites, phone: contacts.phone };
  const dictionary = getRequisitesDictionary(locale);
  const copyText = formatRequisitesCopy(details, dictionary.fields);

  return (
    <>
      <RequisitesContent dictionary={dictionary} details={details} copyText={copyText} />
      <JsonLd data={buildRequisitesBreadcrumbJsonLd(locale)} />
    </>
  );
}
