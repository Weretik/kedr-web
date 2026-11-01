import { categoryPath } from '@site/catalog/model';
import { localizedPath } from '@site/core/i18n';
import Link from 'next/link';

import type { CatalogDictionary } from '../i18n/catalog-dictionary';
import type { CatalogTreeNode } from '@site/catalog/model';
import type { Locale } from '@site/core/i18n';

const VISIBLE_GRANDCHILDREN = 6;

type MegaMenuSectionProps = {
  locale: Locale;
  section: CatalogTreeNode;
  dictionary: CatalogDictionary;
  onNavigate: () => void;
};

/** Right side of the mega menu for one section: its subcategories with their first children. */
export function MegaMenuSection({ locale, section, dictionary, onNavigate }: MegaMenuSectionProps) {
  const href = (node: CatalogTreeNode) => localizedPath(locale, categoryPath(node.slug));

  return (
    <div>
      <Link
        href={href(section)}
        onClick={onNavigate}
        className="text-base font-semibold hover:underline"
      >
        {section.name}
        <span className="ml-2 text-xs font-normal text-muted-foreground">
          {section.productCount}
        </span>
      </Link>
      <ul className="mt-3 grid gap-x-6 gap-y-4 sm:grid-cols-2 xl:grid-cols-3">
        {section.children.map((child) => (
          <li key={child.id}>
            <Link
              href={href(child)}
              onClick={onNavigate}
              className="text-sm font-medium hover:underline"
            >
              {child.name}
            </Link>
            {child.children.length > 0 && (
              <ul className="mt-1 grid gap-0.5">
                {child.children.slice(0, VISIBLE_GRANDCHILDREN).map((grandchild) => (
                  <li key={grandchild.id}>
                    <Link
                      href={href(grandchild)}
                      onClick={onNavigate}
                      className="text-sm text-muted-foreground hover:text-foreground hover:underline"
                    >
                      {grandchild.name}
                    </Link>
                  </li>
                ))}
                {child.children.length > VISIBLE_GRANDCHILDREN && (
                  <li>
                    <Link
                      href={href(child)}
                      onClick={onNavigate}
                      className="text-sm text-brand-text hover:underline"
                    >
                      {dictionary.allInCategory(child.children.length)}
                    </Link>
                  </li>
                )}
              </ul>
            )}
          </li>
        ))}
      </ul>
      <Link
        href={href(section)}
        onClick={onNavigate}
        className="mt-4 inline-block text-sm font-medium text-brand-text hover:underline"
      >
        {dictionary.allInSection}
      </Link>
    </div>
  );
}
