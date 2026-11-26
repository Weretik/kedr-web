import { mapSeoReview } from './seo-review.mapper';

describe('mapSeoReview', () => {
  it('maps known pages and drops unknown kinds, languages and issues', () => {
    expect(
      mapSeoReview([
        { kind: 'category', id: 1, name: 'Ручки', language: 'uk', issues: ['noText', 'future'] },
        { kind: 'brand', id: 2, name: 'X', language: 'uk', issues: ['noText'] },
        { kind: 'model', id: 3, name: 'Y', language: 'en', issues: ['noText'] },
        { kind: 'article', id: 4, name: 'Z', language: 'ru', issues: ['future'] },
      ]),
    ).toEqual([{ id: 1, issues: ['noText'], kind: 'category', language: 'uk', name: 'Ручки' }]);
  });

  it('refuses a malformed answer', () => {
    expect(() => mapSeoReview([{ kind: 'category' }])).toThrow();
  });
});
