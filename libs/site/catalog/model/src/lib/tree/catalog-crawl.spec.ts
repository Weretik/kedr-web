import { closedCategorySlugs, openCrawlNodes } from './catalog-crawl';

import type { CatalogCrawlNode } from './catalog-crawl';

const node = (
  slug: string,
  children: CatalogCrawlNode[] = [],
  isClosedFromSearch = false,
): CatalogCrawlNode => ({ slug, isClosedFromSearch, updatedAt: null, children });

const tree = [
  node('handles', [node('knobs'), node('levers', [node('levers-black')], true)]),
  node('hinges', [node('hidden')], true),
];

describe('catalog crawl tree', () => {
  it('keeps open categories in tree order and drops closed subtrees', () => {
    expect(openCrawlNodes(tree).map((item) => item.slug)).toEqual(['handles', 'knobs']);
  });

  it('lists every closed category with the categories under it', () => {
    expect([...closedCategorySlugs(tree)].sort()).toEqual([
      'hidden',
      'hinges',
      'levers',
      'levers-black',
    ]);
  });
});
