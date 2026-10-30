import { COMPANY } from '@site/core/config';
import { localizedPath } from '@site/core/i18n';
import { Button } from '@site/shared/ui';
import { CheckIcon, PhoneIcon } from 'lucide-react';
import Link from 'next/link';

import type { HomeDictionary } from '../i18n/home-dictionary';
import type { Locale } from '@site/core/i18n';

/** Locale-free address of the cooperation page (content pages, step 6 of the migration plan). */
const WHOLESALE_PATH = '/wholesale';

/** Dark panel with partner benefits, the cooperation page, and a call link. */
export function WholesalePanel({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: HomeDictionary;
}) {
  return (
    <aside
      aria-labelledby="home-wholesale-title"
      className="dark rounded-2xl border border-border bg-background p-6 text-foreground sm:p-8"
    >
      <h2 id="home-wholesale-title" className="text-xl font-semibold">
        {dictionary.wholesaleTitle}
      </h2>
      <ul className="mt-4 grid gap-2.5 text-sm">
        {dictionary.wholesaleBenefits.map((benefit) => (
          <li key={benefit} className="flex items-center gap-2">
            <CheckIcon aria-hidden className="size-4 text-brand" strokeWidth={1.75} />
            {benefit}
          </li>
        ))}
      </ul>
      <div className="mt-6 flex flex-wrap gap-2">
        <Button asChild variant="brand">
          <Link href={localizedPath(locale, WHOLESALE_PATH)}>{dictionary.wholesaleCta}</Link>
        </Button>
        <Button asChild variant="outline">
          <a href={`tel:${COMPANY.phone.e164}`}>
            <PhoneIcon aria-hidden strokeWidth={1.75} />
            {dictionary.wholesaleCall} {COMPANY.phone.display}
          </a>
        </Button>
      </div>
    </aside>
  );
}
