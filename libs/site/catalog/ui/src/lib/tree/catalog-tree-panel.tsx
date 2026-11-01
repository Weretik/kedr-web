'use client';

import { ancestorIds } from '@site/catalog/model';
import { cn } from '@site/shared/ui';
import { PanelLeftCloseIcon, PanelLeftOpenIcon } from 'lucide-react';
import { useMemo, useState } from 'react';

import { TreeBranch } from './tree-branch';
import { useTreeState } from './use-tree-state';
import { getCatalogDictionary } from '../i18n/catalog-dictionary';

import type { CatalogTreeNode } from '@site/catalog/model';
import type { Locale } from '@site/core/i18n';

type CatalogTreePanelProps = {
  locale: Locale;
  tree: readonly CatalogTreeNode[];
  /** The category of the current page, highlighted with its ancestors. */
  activeId?: number | null;
};

/**
 * Category tree beside the listing. Desktop shows it until the visitor hides it; phones open it with a button.
 * Branches collapse one by one; both choices are remembered in this browser.
 */
export function CatalogTreePanel({ locale, tree, activeId = null }: CatalogTreePanelProps) {
  const dictionary = getCatalogDictionary(locale);
  const { collapsed, hidden, toggleBranch, toggleHidden } = useTreeState();
  const [mobileOpen, setMobileOpen] = useState(false);
  const activePath = useMemo(
    () => new Set(activeId === null ? [] : ancestorIds(tree, activeId)),
    [tree, activeId],
  );
  const collapsedSet = useMemo(() => new Set(collapsed), [collapsed]);
  const ToggleIcon = hidden ? PanelLeftOpenIcon : PanelLeftCloseIcon;

  return (
    <aside className={cn('min-w-0', !hidden && 'lg:w-72')}>
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          aria-expanded={mobileOpen}
          aria-controls="catalog-tree"
          className="text-sm font-semibold lg:pointer-events-none"
        >
          {dictionary.treeTitle}
        </button>
        <button
          type="button"
          onClick={toggleHidden}
          aria-expanded={!hidden}
          aria-controls="catalog-tree"
          aria-label={hidden ? dictionary.showTree : dictionary.hideTree}
          title={hidden ? dictionary.showTree : dictionary.hideTree}
          className="hidden size-8 place-items-center rounded hover:bg-muted lg:grid"
        >
          <ToggleIcon className="size-4" strokeWidth={1.75} />
        </button>
      </div>
      <nav
        id="catalog-tree"
        aria-label={dictionary.treeTitle}
        className={cn('mt-2', !mobileOpen && 'max-lg:hidden', hidden && 'lg:hidden')}
      >
        <TreeBranch
          locale={locale}
          nodes={tree}
          activeId={activeId}
          activePath={activePath}
          collapsed={collapsedSet}
          onToggle={toggleBranch}
          dictionary={dictionary}
        />
      </nav>
    </aside>
  );
}
