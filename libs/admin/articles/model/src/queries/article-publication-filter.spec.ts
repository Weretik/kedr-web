import { filterArticlesByPublication } from './article-publication-filter';

import type { ArticleSummary } from '../entities/article';

const row = (id: number, isPublished: boolean): ArticleSummary => ({
  id,
  slug: `a-${id}`,
  title: `A ${id}`,
  publishedOn: '2026-11-04',
  isPublished,
  coverUrl: null,
  hasLegacyCover: false,
  updatedAt: '2026-11-04T10:00:00Z',
  updatedBy: null,
});

describe('article publication filter', () => {
  const rows = [row(1, true), row(2, false), row(3, true)];

  it('keeps all, only published, or only drafts', () => {
    expect(filterArticlesByPublication(rows, 'all').map((a) => a.id)).toEqual([1, 2, 3]);
    expect(filterArticlesByPublication(rows, 'published').map((a) => a.id)).toEqual([1, 3]);
    expect(filterArticlesByPublication(rows, 'draft').map((a) => a.id)).toEqual([2]);
  });
});
