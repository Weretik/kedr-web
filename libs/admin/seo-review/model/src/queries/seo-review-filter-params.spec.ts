import { parseSeoReviewFilter, seoReviewFilterSearch } from './seo-review-filter-params';

describe('seo review filter params', () => {
  it('round-trips a filter', () => {
    const search = seoReviewFilterSearch({ kind: 'model', issue: 'longTitle' });
    expect(parseSeoReviewFilter(search)).toEqual({ kind: 'model', issue: 'longTitle' });
  });

  it('drops unknown values', () => {
    expect(parseSeoReviewFilter('kind=brand&issue=x')).toEqual({});
    expect(seoReviewFilterSearch({})).toBe('');
  });
});
