'use client';

import { categoryPath } from '@site/catalog/model';
import { localizedPath } from '@site/core/i18n';
import { cn } from '@site/shared/ui';
import { ChevronRightIcon } from 'lucide-react';
import Link from 'next/link';

import type { CatalogDictionary } from '../i18n/catalog-dictionary';
import type { CatalogTreeNode } from '@site/catalog/model';
import type { Locale } from '@site/core/i18n';

type TreeBranchProps = {
  locale: Locale;
  nodes: readonly CatalogTreeNode[];
  activeId: number | null;
  /** The active category and its ancestors: highlighted and never collapsed. */
  activePath: ReadonlySet<number>;
  collapsed: ReadonlySet<number>;
  onToggle: (id: number) => void;
  dictionary: CatalogDictionary;
  depth?: number;
};

/** One level of the tree; collapsed children stay in the HTML (hidden), so every link is crawlable. */
export function TreeBranch(props: TreeBranchProps) {
  const { locale, nodes, activeId, activePath, collapsed, onToggle, dictionary, depth = 0 } = props;

  return (
    <ul className={cn('grid grid-cols-1 gap-0.5', depth > 0 && 'ml-3 border-l border-border pl-2')}>
      {nodes.map((node) => {
        const hasChildren = node.children.length > 0;
        const open = hasChildren && (activePath.has(node.id) || !collapsed.has(node.id));
        const current = node.id === activeId;

        return (
          <li key={node.id}>
            <div className="flex items-center gap-1">
              {hasChildren ? (
                <button
                  type="button"
                  onClick={() => onToggle(node.id)}
                  aria-expanded={open}
                  aria-label={open ? dictionary.collapse(node.name) : dictionary.expand(node.name)}
                  className="grid size-6 shrink-0 place-items-center rounded hover:bg-muted"
                >
                  <ChevronRightIcon
                    className={cn('size-3.5 transition-transform', open && 'rotate-90')}
                    strokeWidth={2}
                  />
                </button>
              ) : (
                <span aria-hidden className="size-6 shrink-0" />
              )}
              <Link
                href={localizedPath(locale, categoryPath(node.slug))}
                aria-current={current ? 'page' : undefined}
                className={cn(
                  'flex min-w-0 flex-1 items-baseline justify-between gap-2 rounded px-1.5 py-1 text-sm hover:bg-muted',
                  current && 'bg-brand-soft font-semibold text-brand-text',
                  !current && activePath.has(node.id) && 'font-medium',
                )}
              >
                <span className="min-w-0 break-words">{node.name}</span>
                <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                  {node.productCount}
                </span>
              </Link>
            </div>
            {hasChildren && (
              <div hidden={!open}>
                <TreeBranch {...props} nodes={node.children} depth={depth + 1} />
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
