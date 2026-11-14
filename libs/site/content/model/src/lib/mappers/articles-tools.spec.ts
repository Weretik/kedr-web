import { showArticlesTools } from './articles-tools';
import { DEFAULT_ARTICLES_QUERY } from '../entities/article-types';

describe('showArticlesTools', () => {
  it('hides the tools for a short list opened without choices', () => {
    expect(showArticlesTools({ total: 6, query: DEFAULT_ARTICLES_QUERY })).toBe(false);
    expect(showArticlesTools({ total: 20, query: DEFAULT_ARTICLES_QUERY })).toBe(true);
  });

  it('keeps the tools for any chosen search, page, or size', () => {
    expect(showArticlesTools({ total: 0, query: { ...DEFAULT_ARTICLES_QUERY, q: 'замок' } })).toBe(
      true,
    );
    expect(showArticlesTools({ total: 6, query: { ...DEFAULT_ARTICLES_QUERY, page: 2 } })).toBe(
      true,
    );
    expect(
      showArticlesTools({ total: 6, query: { ...DEFAULT_ARTICLES_QUERY, pageSize: 20 } }),
    ).toBe(true);
  });
});
