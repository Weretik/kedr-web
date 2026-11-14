import { articlePageNumbers } from './article-page-window';

it('keeps long pagination bounded while retaining current and boundary pages', () => {
  expect(articlePageNumbers(2, 3)).toEqual([1, 2, 3]);
  expect(articlePageNumbers(50, 100)).toEqual([1, 'ellipsis', 49, 50, 51, 'ellipsis', 100]);
});
