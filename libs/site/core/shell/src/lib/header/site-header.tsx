import { CategoryBar } from './bars/category-bar';
import { MainBar } from './bars/main-bar';
import { TopBar } from './bars/top-bar';
import { CollapsingHeader } from './collapsing-header';
import { resolveCategoryLinks } from '../navigation/catalog-navigation';

import type { ShellDictionary } from '../i18n/shell-dictionary';
import type { CatalogNavigation } from '../navigation/catalog-navigation';
import type { Locale } from '@site/core/i18n';

/**
 * Three-row header with everything the current storefront header has. On desktop only the category row stays on
 * screen while scrolling, with compact search and cart; phones keep the whole header.
 */
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
    <CollapsingHeader
      className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85"
      collapsible={
        <>
          <TopBar locale={locale} dictionary={dictionary} />
          <MainBar
            locale={locale}
            dictionary={dictionary}
            categoryLinks={categoryLinks}
            catalogMenu={catalogNavigation?.menu}
          />
        </>
      }
    >
      <CategoryBar locale={locale} dictionary={dictionary} links={categoryLinks} />
      <div className="border-b border-border" />
    </CollapsingHeader>
  );
}
