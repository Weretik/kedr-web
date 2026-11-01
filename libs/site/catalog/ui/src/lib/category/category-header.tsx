import { categoryPath } from '@site/catalog/model';
import { localizedPath, pluralize } from '@site/core/i18n';
import Link from 'next/link';

import { getCatalogDictionary } from '../i18n/catalog-dictionary';

import type { CatalogTreeNode } from '@site/catalog/model';
import type { Locale } from '@site/core/i18n';

type CategoryHeaderProps = {
  locale: Locale;
  heading: string;
  productCount: number;
  subcategories: readonly CatalogTreeNode[];
};

/** H1 with the product count and links to the direct subcategories. */
export function CategoryHeader({
  locale,
  heading,
  productCount,
  subcategories,
}: CategoryHeaderProps) {
  const dictionary = getCatalogDictionary(locale);

  return (
    <header className="grid gap-3">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h1 className="text-2xl font-semibold tracking-tight lg:text-3xl">{heading}</h1>
        <span className="text-sm text-muted-foreground">
          {pluralize(locale, productCount, dictionary.products)}
        </span>
      </div>
      {subcategories.length > 0 && (
        // Desktop shows subcategories in the tree panel; the chips are for phones, where the tree is closed.
        <nav aria-label={dictionary.subcategories} className="lg:hidden">
          <ul className="flex flex-wrap gap-2">
            {subcategories.map((child) => (
              <li key={child.id}>
                <Link
                  href={localizedPath(locale, categoryPath(child.slug))}
                  className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-sm hover:bg-muted"
                >
                  {child.name}
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {child.productCount}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
