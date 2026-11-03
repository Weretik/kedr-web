import { getReturnsDictionary } from '@site/content/model';
import { ReturnsContent } from '@site/content/ui';

import type { Locale } from '@site/core/i18n';

/** Localized static returns page; all policy text is rendered on the server. */
export function ReturnsPage({ locale }: { locale: Locale }) {
  return <ReturnsContent dictionary={getReturnsDictionary(locale)} />;
}
