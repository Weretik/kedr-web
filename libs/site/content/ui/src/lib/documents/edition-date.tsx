import { formatEffectiveDate } from '@site/content/model';

import type { Locale } from '@site/core/i18n';

const LABEL: Readonly<Record<Locale, string>> = { uk: 'Редакція від', ru: 'Редакция от' };

/** «Редакція від 3 листопада 2026 р.» under a legal document title. */
export function EditionDate({
  locale,
  effectiveFrom,
  className,
}: {
  locale: Locale;
  effectiveFrom: string;
  className?: string;
}) {
  return (
    <p data-document-edition className={className}>
      {LABEL[locale]}{' '}
      <time dateTime={effectiveFrom}>{formatEffectiveDate(effectiveFrom, locale)}</time>
    </p>
  );
}
