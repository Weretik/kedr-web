import { categoryPath } from '@site/catalog/model';
import { localizedPath, pluralize } from '@site/core/i18n';
import { cn } from '@site/shared/ui';
import Link from 'next/link';

import { getCatalogDictionary } from '../i18n/catalog-dictionary';

import type { CatalogTreeNode } from '@site/catalog/model';
import type { Locale } from '@site/core/i18n';

type CategoryHeaderProps = {
  locale: Locale;
  heading: string;
  productCount: number;
  /** What the count counts; a value page counts models. */
  countOf?: 'products' | 'models';
  /** Opening line under the heading (value pages). */
  intro?: string;
  /** Chips under the heading: the subcategories, or the sibling categories of a category without them. */
  chips: readonly CatalogTreeNode[];
  /** The chip of the current category, marked when the chips are its siblings. */
  activeId?: number;
};

/** H1 with the product count and category chips under it. */
export function CategoryHeader({
  locale,
  heading,
  productCount,
  countOf = 'products',
  intro,
  chips,
  activeId,
}: CategoryHeaderProps) {
  const dictionary = getCatalogDictionary(locale);

  return (
    <header className="grid gap-4">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h1 className="text-2xl font-semibold tracking-tight lg:text-3xl">{heading}</h1>
        <span className="text-sm text-muted-foreground">
          {pluralize(locale, productCount, dictionary[countOf])}
        </span>
      </div>
      {intro && <p className="max-w-3xl text-sm text-muted-foreground">{intro}</p>}
      {chips.length > 0 && (
        <nav aria-label={dictionary.subcategories}>
          <ul className="flex flex-wrap gap-2">
            {chips.map((chip) => {
              const active = chip.id === activeId;
              return (
                <li key={chip.id}>
                  <Link
                    href={localizedPath(locale, categoryPath(chip.slug))}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors',
                      active
                        ? 'border-brand bg-brand text-brand-foreground'
                        : 'border-border hover:bg-muted',
                    )}
                  >
                    {chip.name}
                    <span
                      className={cn(
                        'text-xs tabular-nums',
                        active ? 'text-brand-foreground/80' : 'text-muted-foreground',
                      )}
                    >
                      {chip.productCount}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </header>
  );
}
