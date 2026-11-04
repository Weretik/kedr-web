import { localizedPath } from '@site/core/i18n';
import { HomeIcon } from 'lucide-react';
import Link from 'next/link';

import { EditionDate } from '../documents/edition-date';

import type { LegalDocument, PrivacyDictionary } from '@site/content/model';

export function PrivacyHeader({
  dictionary,
  document,
}: {
  dictionary: PrivacyDictionary;
  document: LegalDocument;
}) {
  return (
    <header>
      <nav
        aria-label={dictionary.breadcrumbLabel}
        className="mb-5 flex min-w-0 items-start gap-2 text-sm text-muted-foreground"
      >
        <Link
          href={localizedPath(dictionary.locale, '/')}
          aria-label={dictionary.home}
          className="shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          <HomeIcon aria-hidden size={18} strokeWidth={1.75} />
        </Link>
        <span aria-hidden>/</span>
        <span aria-current="page" className="min-w-0 break-words">
          {dictionary.title}
        </span>
      </nav>
      <h1 className="break-words text-3xl font-bold tracking-tight sm:text-4xl">
        {dictionary.title}
      </h1>
      <p className="mt-3 max-w-[75ch] leading-relaxed">{dictionary.intro}</p>
      <EditionDate
        locale={dictionary.locale}
        effectiveFrom={document.effectiveFrom}
        className="mt-2 text-sm text-muted-foreground"
      />
    </header>
  );
}
