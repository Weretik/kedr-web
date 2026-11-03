import { localizedPath } from '@site/core/i18n';
import { HomeIcon } from 'lucide-react';
import Link from 'next/link';

import type { ReturnsDictionary } from '@site/content/model';

const anchorClass =
  'text-sm font-medium text-brand-text underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring';

export function ReturnsHeader({ dictionary }: { dictionary: ReturnsDictionary }) {
  return (
    <header>
      <nav
        aria-label={dictionary.breadcrumbLabel}
        className="mb-5 flex items-center gap-2 text-sm text-muted-foreground"
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
      <nav aria-label={dictionary.navigationLabel} className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
        <a href="#return-conditions" className={anchorClass}>
          {dictionary.conditionsTitle}
        </a>
        <a href="#return-warranty" className={anchorClass}>
          {dictionary.warrantyLink}
        </a>
        <a href="#return-process" className={anchorClass}>
          {dictionary.processLink}
        </a>
      </nav>
    </header>
  );
}
