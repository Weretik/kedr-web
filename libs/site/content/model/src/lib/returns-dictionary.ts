import { RETURNS_SUMMARIES } from './returns-summary-copy';

import type { ReturnsDictionary } from './returns-types';
import type { Locale } from '@site/core/i18n';

/** Page chrome of the returns page; the full rules are the published document. */
export function getReturnsDictionary(locale: Locale): ReturnsDictionary {
  return { locale, ...RETURNS_SUMMARIES[locale] };
}
