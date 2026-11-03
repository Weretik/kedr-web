import { localizedPath } from '@site/core/i18n';
import { HomeIcon } from 'lucide-react';
import Link from 'next/link';

import type { RequisitesDictionary } from '@site/content/model';

const anchorClass =
  'text-sm font-medium text-brand-text underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring';

export function RequisitesHeader({ dictionary }: { dictionary: RequisitesDictionary }) {
  return (
    <header>
      <nav
        aria-label={dictionary.breadcrumbLabel}
        className="mb-5 flex min-w-0 items-center gap-2 text-sm text-muted-foreground"
      >
        <Link
          href={localizedPath(dictionary.locale, '/')}
          aria-label={dictionary.home}
          className="focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          <HomeIcon aria-hidden size={18} strokeWidth={1.75} />
        </Link>
        <span aria-hidden>/</span>
        <span aria-current="page">{dictionary.title}</span>
      </nav>
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{dictionary.title}</h1>
      <p className="mt-3 max-w-3xl leading-relaxed">{dictionary.intro}</p>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
        {dictionary.paymentNote}
      </p>
      <nav aria-label={dictionary.navigationLabel} className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
        <a href="#requisites-administration" className={anchorClass}>
          {dictionary.administrationLink}
        </a>
        <a href="#requisites-bank" className={anchorClass}>
          {dictionary.bankLink}
        </a>
        <a href="#requisites-payment" className={anchorClass}>
          {dictionary.paymentLink}
        </a>
      </nav>
    </header>
  );
}
