import { articlePath } from './article-routes';

it('builds escaped article detail paths', () => {
  expect(articlePath('safe slug')).toBe('/articles/safe%20slug');
});
