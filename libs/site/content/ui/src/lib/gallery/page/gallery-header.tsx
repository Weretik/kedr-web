import { getGalleryDictionary } from '@site/content/model';
import { localizedPath } from '@site/core/i18n';
import { HomeIcon } from 'lucide-react';
import Link from 'next/link';

import type { Locale } from '@site/core/i18n';

/** Server-compatible heading; collection controls belong to the client island below it. */
export function GalleryHeader({ locale }: { locale: Locale }) {
  const dictionary = getGalleryDictionary(locale);

  return (
    <header>
      <nav aria-label={dictionary.breadcrumbs} className="mb-5 text-sm text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link
              href={localizedPath(locale, '/')}
              aria-label={dictionary.home}
              className="inline-flex rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              <HomeIcon aria-hidden size={18} strokeWidth={1.75} />
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li aria-current="page">{dictionary.title}</li>
        </ol>
      </nav>
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{dictionary.title}</h1>
      <p className="mt-3 max-w-3xl leading-relaxed text-muted-foreground">{dictionary.intro}</p>
    </header>
  );
}
