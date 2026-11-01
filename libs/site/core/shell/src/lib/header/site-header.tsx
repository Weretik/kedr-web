import { CategoryBar } from './bars/category-bar';
import { MainBar } from './bars/main-bar';
import { TopBar } from './bars/top-bar';
import { resolveCategoryLinks } from '../navigation/catalog-navigation';

import type { ShellDictionary } from '../i18n/shell-dictionary';
import type { CatalogNavigation } from '../navigation/catalog-navigation';
import type { Locale } from '@site/core/i18n';

/** Sticky three-row header with everything the current storefront header has. */
export function SiteHeader({
  locale,
  dictionary,
  catalogNavigation,
}: {
  locale: Locale;
  dictionary: ShellDictionary;
  catalogNavigation?: CatalogNavigation;
}) {
  const categoryLinks = resolveCategoryLinks(dictionary, catalogNavigation);

  return (
    <header className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85">
      <TopBar locale={locale} dictionary={dictionary} />
      <MainBar
        locale={locale}
        dictionary={dictionary}
        categoryLinks={categoryLinks}
        catalogMenu={catalogNavigation?.menu}
      />
      <CategoryBar locale={locale} dictionary={dictionary} links={categoryLinks} />
      <div className="border-b border-border" />
    </header>
  );
}
