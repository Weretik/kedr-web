import { SiteFooter } from '../footer/site-footer';
import { SiteHeader } from '../header/frame/site-header';
import { getShellDictionary } from '../i18n/shell-dictionary';
import { resolveCategoryLinks } from '../navigation/catalog-navigation';

import type { CatalogNavigation } from '../navigation/catalog-navigation';
import type { CompanyContacts } from '@site/core/config';
import type { Locale } from '@site/core/i18n';
import type { ReactNode } from 'react';

type SiteShellProps = {
  locale: Locale;
  /** Sales contacts from the admin (or their code fallback) for the header and footer. */
  contacts: CompanyContacts;
  /** Catalog sections and mega menu from the catalog domain; fixed sections are used without it. */
  catalogNavigation?: CatalogNavigation;
  /** App-composed cart controls; the shell keeps its localized links when omitted. */
  cartAction?: ReactNode;
  compactCartAction?: ReactNode;
  children: ReactNode;
};

/** Page frame for every localized route: skip link, header, main content, and footer. */
export function SiteShell({
  locale,
  contacts,
  catalogNavigation,
  cartAction,
  compactCartAction,
  children,
}: SiteShellProps) {
  const dictionary = getShellDictionary(locale);

  return (
    <>
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
      >
        {dictionary.skipToContent}
      </a>
      <SiteHeader
        locale={locale}
        dictionary={dictionary}
        contacts={contacts}
        catalogNavigation={catalogNavigation}
        cartAction={cartAction}
        compactCartAction={compactCartAction}
      />
      <main id="content" className="mx-auto w-full max-w-[90rem] flex-1 px-4 py-8 lg:px-6">
        {children}
      </main>
      <SiteFooter
        locale={locale}
        dictionary={dictionary}
        contacts={contacts}
        categoryLinks={resolveCategoryLinks(dictionary, catalogNavigation)}
      />
    </>
  );
}
