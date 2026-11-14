import { categoryPath } from '@site/catalog/model';
import { localizedPath } from '@site/core/i18n';
import { cn } from '@site/shared/ui';
import Link from 'next/link';

import type { CatalogTreeNode } from '@site/catalog/model';
import type { Locale } from '@site/core/i18n';

type MegaMenuRailProps = {
  locale: Locale;
  rail: readonly CatalogTreeNode[];
  activeId: number | null;
  /** The first of the sections shown after a divider. */
  firstSeparated: number | undefined;
  onActivate: (id: number) => void;
  onNavigate: () => void;
};

/** The left column of the mega menu: top sections with their product counts; hover or focus shows a section. */
export function MegaMenuRail({
  activeId,
  firstSeparated,
  locale,
  onActivate,
  onNavigate,
  rail,
}: MegaMenuRailProps) {
  return (
    <ul className="overflow-y-auto border-r border-border p-2">
      {rail.map((section) => (
        <li
          key={section.id}
          className={cn(section.id === firstSeparated && 'mt-2 border-t border-border pt-2')}
        >
          <Link
            href={localizedPath(locale, categoryPath(section.slug))}
            onClick={onNavigate}
            onMouseEnter={() => onActivate(section.id)}
            onFocus={() => onActivate(section.id)}
            className={cn(
              'flex items-center justify-between gap-2 rounded-md px-3 py-2 text-sm',
              section.id === activeId ? 'bg-muted font-medium' : 'hover:bg-muted/60',
            )}
          >
            {section.name}
            <span className="text-xs text-muted-foreground tabular-nums">
              {section.productCount}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
