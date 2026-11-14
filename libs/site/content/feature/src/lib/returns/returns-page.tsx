import { getReturnsDictionary } from '@site/content/model';
import { ReturnsContent } from '@site/content/ui';
import { getCompanyContacts } from '@site/shared/company';

import { loadLegalDocument } from '../documents/load-legal-document';

import type { Locale } from '@site/core/i18n';

/** Summary blocks from code above the published full rules. */
export async function ReturnsPage({ locale }: { locale: Locale }) {
  const contacts = await getCompanyContacts();
  const document = await loadLegalDocument(locale, 'returns-policy', contacts, 'returns');
  return (
    <ReturnsContent
      dictionary={getReturnsDictionary(locale)}
      document={document}
      phone={contacts.phone}
    />
  );
}
