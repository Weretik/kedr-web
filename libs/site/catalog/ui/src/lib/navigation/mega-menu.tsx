'use client';

import { categoryPath } from '@site/catalog/model';
import { localizedPath } from '@site/core/i18n';
import { cn } from '@site/shared/ui';
import { LayoutGridIcon, SearchIcon } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useId, useMemo, useRef, useState } from 'react';

import { MegaMenuSearchResults } from './mega-menu-search';
import { MegaMenuSection } from './mega-menu-section';
import { useDismiss } from './use-dismiss';
import { getCatalogDictionary } from '../i18n/catalog-dictionary';

import type { CatalogTreeNode } from '@site/catalog/model';
import type { Locale } from '@site/core/i18n';

const NO_IDS: readonly number[] = [];

type MegaMenuProps = {
  locale: Locale;
  tree: readonly CatalogTreeNode[];
  /** Locale-free paths of the catalog hub and the wholesale page. */
  catalogPath: string;
  wholesalePath: string;
  /** Sections shown last in the rail after a divider (doors). */
  separateIds?: readonly number[];
};

/**
 * «Каталог» button with sections on the left, the hovered section's subcategories on the right, and a
 * category search. Every section's links are in the HTML (inactive ones hidden), so crawlers see the tree.
 */
export function MegaMenu({
  locale,
  tree,
  catalogPath,
  wholesalePath,
  separateIds = NO_IDS,
}: MegaMenuProps) {
  const dictionary = getCatalogDictionary(locale);
  const rail = useMemo(
    () => [
      ...tree.filter((section) => !separateIds.includes(section.id)),
      ...tree.filter((section) => separateIds.includes(section.id)),
    ],
    [tree, separateIds],
  );
  const firstSeparated = rail.find((section) => separateIds.includes(section.id))?.id;
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState(rail[0]?.id ?? null);
  const [term, setTerm] = useState('');
  const rootRef = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const close = useCallback(() => setOpen(false), []);
  useDismiss(rootRef, open, close);

  const navigate = () => {
    setOpen(false);
    setTerm('');
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={panelId}
        className="inline-flex h-10 items-center gap-2 rounded-md bg-brand px-4 text-sm font-medium text-brand-foreground hover:bg-brand/90"
      >
        <LayoutGridIcon className="size-4" strokeWidth={1.75} />
        {dictionary.catalog}
      </button>

      <div
        id={panelId}
        hidden={!open}
        role="region"
        aria-label={dictionary.catalogMenu}
        className="absolute top-full left-0 z-40 mt-2 w-[min(64rem,calc(100vw-2rem))] rounded-xl border border-border bg-background shadow-lg"
      >
        <div className="border-b border-border p-3">
          <label className="relative block">
            <span className="sr-only">{dictionary.searchCategories}</span>
            <SearchIcon
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
              strokeWidth={1.75}
            />
            <input
              type="search"
              value={term}
              onChange={(event) => setTerm(event.target.value)}
              placeholder={dictionary.searchCategories}
              autoComplete="off"
              className="h-10 w-full rounded-md border border-border bg-muted pr-3 pl-9 text-sm outline-none focus-visible:border-ring"
            />
          </label>
        </div>

        {term.trim() ? (
          <div className="max-h-[70vh] overflow-y-auto p-3">
            <MegaMenuSearchResults
              locale={locale}
              tree={tree}
              term={term}
              dictionary={dictionary}
              onNavigate={navigate}
            />
          </div>
        ) : (
          <div className="grid max-h-[70vh] grid-cols-[15rem_minmax(0,1fr)]">
            <ul className="overflow-y-auto border-r border-border p-2">
              {rail.map((section) => (
                <li
                  key={section.id}
                  className={cn(
                    section.id === firstSeparated && 'mt-2 border-t border-border pt-2',
                  )}
                >
                  <Link
                    href={localizedPath(locale, categoryPath(section.slug))}
                    onClick={navigate}
                    onMouseEnter={() => setActiveId(section.id)}
                    onFocus={() => setActiveId(section.id)}
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
            <div className="overflow-y-auto p-4">
              {tree.map((section) => (
                <div key={section.id} hidden={section.id !== activeId}>
                  <MegaMenuSection
                    locale={locale}
                    section={section}
                    dictionary={dictionary}
                    onNavigate={navigate}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3 text-sm">
          <Link
            href={localizedPath(locale, catalogPath)}
            onClick={navigate}
            className="font-medium hover:underline"
          >
            {dictionary.allCatalog}
          </Link>
          <Link
            href={localizedPath(locale, wholesalePath)}
            onClick={navigate}
            className="text-brand-text hover:underline"
          >
            {dictionary.wholesale} ·{' '}
            <span className="text-muted-foreground">{dictionary.wholesaleNote}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
