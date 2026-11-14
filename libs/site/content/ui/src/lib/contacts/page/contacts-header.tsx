import { localizedPath } from '@site/core/i18n';
import { HomeIcon } from 'lucide-react';
import Link from 'next/link';

import type { ContactsDictionary } from '@site/content/model';

const textLinkClass =
  'inline-flex min-h-11 items-center gap-2 text-sm font-medium text-brand-text underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring';

export function ContactsHeader({ dictionary }: { dictionary: ContactsDictionary }) {
  return (
    <header>
      <nav
        aria-label={dictionary.breadcrumbLabel}
        className="mb-4 flex items-center gap-2 text-sm text-muted-foreground"
      >
        <Link
          href={localizedPath(dictionary.locale, '/')}
          aria-label={dictionary.home}
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          <HomeIcon aria-hidden className="size-4" strokeWidth={1.75} />
        </Link>
        <span aria-hidden>/</span>
        <span aria-current="page">{dictionary.title}</span>
      </nav>
      <h1 className="text-3xl leading-tight font-bold tracking-tight sm:text-4xl lg:text-[2.5rem]">
        {dictionary.title}
      </h1>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        {dictionary.intro}
      </p>
      <nav aria-label={dictionary.navigationLabel} className="mt-3 flex flex-wrap gap-x-6 gap-y-1">
        <a href="#contacts-connect" className={textLinkClass}>
          {dictionary.connectLink}
        </a>
        <a href="#contacts-location" className={textLinkClass}>
          {dictionary.locationLink}
        </a>
        <a href="#contacts-wholesale" className={textLinkClass}>
          {dictionary.wholesaleLink}
        </a>
      </nav>
    </header>
  );
}
