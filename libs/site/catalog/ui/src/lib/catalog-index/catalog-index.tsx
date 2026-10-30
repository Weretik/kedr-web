import { categoryPath } from '@site/catalog/model';
import { localizedPath } from '@site/core/i18n';
import Link from 'next/link';

import { getCatalogDictionary } from '../i18n/catalog-dictionary';

import type { CatalogSection } from '@site/catalog/model';
import type { Locale } from '@site/core/i18n';

/** Subcategories shown per section before the «all» link. */
export const CATALOG_INDEX_CHILD_LIMIT = 8;

type CatalogIndexProps = { locale: Locale; sections: readonly CatalogSection[] };

/** Every top-level category (H3 under the block's H2) with its first subcategories as crawlable links. */
export function CatalogIndex({ locale, sections }: CatalogIndexProps) {
  const dictionary = getCatalogDictionary(locale);

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {sections.map((section) => {
        const href = localizedPath(locale, categoryPath(section.slug));
        const shown = section.children.slice(0, CATALOG_INDEX_CHILD_LIMIT);

        return (
          <li key={section.id} className="rounded-xl border border-border p-5">
            <h3 className="text-base font-semibold">
              <Link href={href} className="hover:text-brand-text hover:underline">
                {section.name}
              </Link>
            </h3>
            {shown.length > 0 && (
              <ul className="mt-3 grid gap-1.5 text-sm text-muted-foreground">
                {shown.map((child) => (
                  <li key={child.id}>
                    <Link
                      href={localizedPath(locale, categoryPath(child.slug))}
                      className="hover:text-foreground hover:underline"
                    >
                      {child.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            {section.children.length > shown.length && (
              <Link
                href={href}
                className="mt-3 inline-block text-sm font-medium text-brand-text hover:underline"
              >
                {dictionary.allInCategory(section.children.length)} →
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}
