import { localizedPath } from '@site/core/i18n';
import Link from 'next/link';

import type { Locale } from '@site/core/i18n';

export function RequisitesLegalLinks({
  locale,
  title,
  offerLabel,
  privacyLabel,
}: {
  locale: Locale;
  title: string;
  offerLabel: string;
  privacyLabel: string;
}) {
  return (
    <section aria-labelledby="requisites-legal-title" className="min-w-0">
      <h2 id="requisites-legal-title" className="text-xl font-bold tracking-tight sm:text-2xl">
        {title}
      </h2>
      <ul className="mt-3 space-y-3 text-sm">
        <li>
          <Link
            href={localizedPath(locale, '/public-offer')}
            className="font-medium text-brand-text underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            {offerLabel}
          </Link>
        </li>
        <li>
          <Link
            href={localizedPath(locale, '/privacy-policy')}
            className="font-medium text-brand-text underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            {privacyLabel}
          </Link>
        </li>
      </ul>
    </section>
  );
}
