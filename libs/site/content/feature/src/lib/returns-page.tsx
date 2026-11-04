import { getReturnsDictionary } from '@site/content/model';
import { ReturnsContent } from '@site/content/ui';
import { getCompanyContacts } from '@site/shared/company';

import type { Locale } from '@site/core/i18n';

/** Localized static returns page; all policy text is rendered on the server. */
export async function ReturnsPage({ locale }: { locale: Locale }) {
  const { phone } = await getCompanyContacts();
  return <ReturnsContent dictionary={getReturnsDictionary(locale)} phone={phone} />;
}
