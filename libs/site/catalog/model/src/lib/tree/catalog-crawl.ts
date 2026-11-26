/**
 * A category as search engines see it, for the sitemaps: a category the admin closed from search, and every
 * category under it, stays out; `updatedAt` is its `lastmod` (`null` when the API gives none).
 */
export type CatalogCrawlNode = {
  slug: string;
  isClosedFromSearch: boolean;
  updatedAt: string | null;
  children: CatalogCrawlNode[];
};

/** Categories open to search, parents before children; a closed category hides its whole subtree. */
export function openCrawlNodes(tree: readonly CatalogCrawlNode[]): CatalogCrawlNode[] {
  return tree.flatMap((node) =>
    node.isClosedFromSearch ? [] : [node, ...openCrawlNodes(node.children)],
  );
}

/** Slugs of closed categories and everything under them, to keep their models out of the sitemap. */
export function closedCategorySlugs(tree: readonly CatalogCrawlNode[]): Set<string> {
  const closed = new Set<string>();
  const walk = (nodes: readonly CatalogCrawlNode[], underClosed: boolean) => {
    for (const node of nodes) {
      const isClosed = underClosed || node.isClosedFromSearch;
      if (isClosed) closed.add(node.slug);
      walk(node.children, isClosed);
    }
  };
  walk(tree, false);
  return closed;
}
