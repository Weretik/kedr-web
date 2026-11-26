import { describe, expect, it } from 'vitest';

import { countSeoIssues, filterSeoReview, seoReviewEditPath } from './seo-review-filter';

import type { SeoReviewItem } from '../entities/seo-review-item';

const items: SeoReviewItem[] = [
  { id: 3, kind: 'article', language: 'uk', name: 'Петлі', issues: ['noDescription'] },
  { id: 1, kind: 'category', language: 'ru', name: 'Ручки', issues: ['noText', 'noDescription'] },
  { id: 1, kind: 'category', language: 'uk', name: 'Ручки', issues: ['noText'] },
  { id: 7, kind: 'model', language: 'uk', name: 'Альфа', issues: ['longTitle', 'duplicateTitle'] },
];

describe('filterSeoReview', () => {
  it('orders by kind, name and puts uk before ru', () => {
    expect(filterSeoReview(items, {}).map((item) => `${item.kind}:${item.language}`)).toEqual([
      'category:uk',
      'category:ru',
      'model:uk',
      'article:uk',
    ]);
  });

  it('keeps only the chosen kind and issue', () => {
    expect(filterSeoReview(items, { issue: 'noDescription' }).map((item) => item.id)).toEqual([
      1, 3,
    ]);
    expect(filterSeoReview(items, { kind: 'model' }).map((item) => item.id)).toEqual([7]);
  });
});

describe('countSeoIssues', () => {
  it('counts every issue, within a kind when one is chosen', () => {
    expect(countSeoIssues(items)).toEqual({
      duplicateTitle: 1,
      longDescription: 0,
      longTitle: 1,
      noDescription: 2,
      noText: 2,
    });
    expect(countSeoIssues(items, 'article').noDescription).toBe(1);
  });
});

describe('seoReviewEditPath', () => {
  it('opens the editor of each kind', () => {
    expect(seoReviewEditPath({ id: 1, kind: 'category' })).toBe('/categories/1');
    expect(seoReviewEditPath({ id: 7, kind: 'model' })).toBe('/site-models/7');
    expect(seoReviewEditPath({ id: 3, kind: 'article' })).toBe('/articles/3');
  });
});
