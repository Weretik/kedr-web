import { localizedPath } from '@site/core/i18n';
import { ChevronRightIcon, HomeIcon } from 'lucide-react';
import Link from 'next/link';

import { EditionDate } from '../../documents/edition-date';
import { PublicOfferPrintButton } from '../document/public-offer-print-button';

import type { LegalDocument, PublicOfferDictionary } from '@site/content/model';

export function PublicOfferHeader({
  dictionary,
  document,
}: {
  dictionary: PublicOfferDictionary;
  document: LegalDocument;
}) {
  return (
    <header>
      <nav
        data-offer-breadcrumb
        aria-label={dictionary.breadcrumbLabel}
        className="text-xs text-muted-foreground"
      >
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link
              href={localizedPath(dictionary.locale)}
              aria-label={dictionary.home}
              className="flex items-center rounded-sm hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              <HomeIcon aria-hidden className="size-4" strokeWidth={1.75} />
            </Link>
          </li>
          <li aria-current="page" className="flex items-center gap-2">
            <ChevronRightIcon aria-hidden className="size-3.5" strokeWidth={1.75} />
            {dictionary.title}
          </li>
        </ol>
      </nav>
      <div className="mt-7 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
        <div className="min-w-0">
          <h1 className="text-[2rem] leading-tight font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {dictionary.title}
          </h1>
          <p className="mt-4 max-w-[75ch] text-base leading-relaxed text-muted-foreground sm:text-lg">
            {document.title}
          </p>
          <EditionDate
            locale={dictionary.locale}
            effectiveFrom={document.effectiveFrom}
            className="mt-2 text-sm text-muted-foreground"
          />
        </div>
        <div data-offer-actions className="shrink-0 sm:pt-1">
          <PublicOfferPrintButton label={dictionary.print} hint={dictionary.printHint} />
        </div>
      </div>
    </header>
  );
}
