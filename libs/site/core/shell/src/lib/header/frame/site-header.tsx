import { CollapsingHeader } from './collapsing-header';
import { resolveCategoryLinks } from '../../navigation/catalog-navigation';
import { CategoryBar } from '../bars/category-bar';
import { MainBar } from '../bars/main-bar';
import { TopBar } from '../bars/top-bar';

import type { ShellDictionary } from '../../i18n/shell-dictionary';
import type { CatalogNavigation } from '../../navigation/catalog-navigation';
import type { CompanyContacts } from '@site/core/config';
import type { Locale } from '@site/core/i18n';
import type { ReactNode } from 'react';

/**
 * Three-row header with everything the current storefront header has. On desktop only the category row stays on
 * screen while scrolling, with compact search and cart; phones keep the whole header.
 */
export function SiteHeader({
  locale,
  dictionary,
  contacts,
  catalogNavigation,
  cartAction,
  compactCartAction,
}: {
  locale: Locale;
  dictionary: ShellDictionary;
  contacts: CompanyContacts;
  catalogNavigation?: CatalogNavigation;
  cartAction?: ReactNode;
  compactCartAction?: ReactNode;
}) {
  const categoryLinks = resolveCategoryLinks(dictionary, catalogNavigation);

  return (
    <CollapsingHeader
      className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85"
      collapsible={
        <>
          <TopBar locale={locale} dictionary={dictionary} contacts={contacts} />
          <MainBar
            locale={locale}
            dictionary={dictionary}
            contacts={contacts}
            categoryLinks={categoryLinks}
            catalogMenu={catalogNavigation?.menu}
            cartAction={cartAction}
          />
        </>
      }
    >
      <CategoryBar
        locale={locale}
        dictionary={dictionary}
        links={categoryLinks}
        compactCartAction={compactCartAction}
      />
      <div className="border-b border-border" />
    </CollapsingHeader>
  );
}
