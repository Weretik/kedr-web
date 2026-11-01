import { categoryPath, searchCatalogTree } from '@site/catalog/model';
import { localizedPath } from '@site/core/i18n';
import Link from 'next/link';

import type { CatalogDictionary } from '../i18n/catalog-dictionary';
import type { CatalogTreeNode } from '@site/catalog/model';
import type { Locale } from '@site/core/i18n';

type MegaMenuSearchResultsProps = {
  locale: Locale;
  tree: readonly CatalogTreeNode[];
  term: string;
  dictionary: CatalogDictionary;
  onNavigate: () => void;
};

/** Categories at any depth matching the typed words, each with its path for context. */
export function MegaMenuSearchResults({
  locale,
  tree,
  term,
  dictionary,
  onNavigate,
}: MegaMenuSearchResultsProps) {
  const matches = searchCatalogTree(tree, term);
  if (!matches.length) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">{dictionary.noCategories}</p>
    );
  }

  return (
    <ul className="grid gap-1 sm:grid-cols-2">
      {matches.map(({ node, path }) => (
        <li key={node.id}>
          <Link
            href={localizedPath(locale, categoryPath(node.slug))}
            onClick={onNavigate}
            className="block rounded-md px-3 py-2 hover:bg-muted"
          >
            <span className="block text-sm font-medium">{node.name}</span>
            {path.length > 0 && (
              <span className="block text-xs text-muted-foreground">{path.join(' › ')}</span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}
