import { localizedPath } from '@site/core/i18n';
import { ChevronRightIcon } from 'lucide-react';
import Link from 'next/link';

import type { ContactsDictionary } from '../i18n/contacts-dictionary';
import type { Locale } from '@site/core/i18n';

export function ContactsHeading({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: ContactsDictionary;
}) {
  return (
    <header className="mb-8 sm:mb-10">
      <nav aria-label={dictionary.breadcrumbs} className="mb-5 text-sm text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link
              href={localizedPath(locale)}
              className="rounded-sm hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {dictionary.home}
            </Link>
          </li>
          <li aria-hidden>
            <ChevronRightIcon className="size-3.5" strokeWidth={1.75} />
          </li>
          <li aria-current="page">{dictionary.heading}</li>
        </ol>
      </nav>
      <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">{dictionary.heading}</h1>
      <p className="mt-4 max-w-4xl text-base leading-relaxed text-muted-foreground sm:text-lg">
        {dictionary.lead}
      </p>
    </header>
  );
}
