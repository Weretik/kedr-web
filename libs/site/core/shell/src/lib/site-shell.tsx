import { SiteFooter } from './footer/site-footer';
import { SiteHeader } from './header/site-header';
import { getShellDictionary } from './i18n/shell-dictionary';

import type { Locale } from '@site/core/i18n';
import type { ReactNode } from 'react';

/** Page frame for every localized route: skip link, header, main content, and footer. */
export function SiteShell({ locale, children }: { locale: Locale; children: ReactNode }) {
  const dictionary = getShellDictionary(locale);

  return (
    <>
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
      >
        {dictionary.skipToContent}
      </a>
      <SiteHeader locale={locale} dictionary={dictionary} />
      <main id="content" className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 lg:px-6">
        {children}
      </main>
      <SiteFooter locale={locale} dictionary={dictionary} />
    </>
  );
}
