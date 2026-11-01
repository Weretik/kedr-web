import { categoryPath } from '@site/catalog/model';
import { localizedPath, pluralize } from '@site/core/i18n';
import { PackageIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { CATEGORY_IMAGES } from './category-images';
import { getCatalogDictionary } from '../i18n/catalog-dictionary';

import type { CatalogTreeNode } from '@site/catalog/model';
import type { Locale } from '@site/core/i18n';

/** Subcategory links under each card before the «all» link. */
export const CATEGORY_CARD_CHILD_LIMIT = 5;

type CategoryCardsProps = {
  locale: Locale;
  categories: readonly CatalogTreeNode[];
  /** Load the first row's photos eagerly: the grid is the first thing on the page. */
  priority?: boolean;
};

/** Categories as photo cards: the photo and name open the category, with its count and first subcategories. */
export function CategoryCards({ locale, categories, priority = false }: CategoryCardsProps) {
  const dictionary = getCatalogDictionary(locale);

  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category, index) => {
        const href = localizedPath(locale, categoryPath(category.slug));
        const image = CATEGORY_IMAGES[category.id];
        const shown = category.children.slice(0, CATEGORY_CARD_CHILD_LIMIT);

        return (
          <li
            key={category.id}
            className="group overflow-hidden rounded-xl border border-border transition-colors hover:border-brand"
          >
            <Link href={href} className="block">
              <div className="relative aspect-[4/3] bg-muted">
                {image ? (
                  <Image
                    src={image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 30rem, (min-width: 640px) 50vw, 100vw"
                    priority={priority && index < 3}
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.02] motion-reduce:transition-none"
                  />
                ) : (
                  <PackageIcon
                    aria-hidden
                    className="absolute inset-0 m-auto size-12 text-muted-foreground/50"
                    strokeWidth={1.5}
                  />
                )}
              </div>
              <div className="flex items-baseline justify-between gap-3 px-5 pt-4">
                <h3 className="text-lg font-semibold group-hover:text-brand-text">
                  {category.name}
                </h3>
                <span className="shrink-0 text-sm text-muted-foreground tabular-nums">
                  {pluralize(locale, category.productCount, dictionary.products)}
                </span>
              </div>
            </Link>
            {shown.length > 0 && (
              <ul className="flex flex-wrap gap-x-3 gap-y-1 px-5 pt-2 pb-4 text-sm text-muted-foreground">
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
                {category.children.length > shown.length && (
                  <li>
                    <Link href={href} className="font-medium text-brand-text hover:underline">
                      {dictionary.allInCategory(category.children.length)} →
                    </Link>
                  </li>
                )}
              </ul>
            )}
            {shown.length === 0 && <div className="pb-4" />}
          </li>
        );
      })}
    </ul>
  );
}
