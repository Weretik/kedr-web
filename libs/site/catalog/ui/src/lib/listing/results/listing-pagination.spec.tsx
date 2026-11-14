import { DEFAULT_LISTING_QUERY } from '@site/catalog/model';
import { render, screen } from '@testing-library/react';

import { ListingPagination, paginationItems } from './listing-pagination';

describe('paginationItems', () => {
  it('keeps the first, last, and neighbours of the current page with gaps', () => {
    expect(paginationItems(1, 1)).toEqual([1]);
    expect(paginationItems(5, 10)).toEqual([1, null, 4, 5, 6, null, 10]);
    expect(paginationItems(2, 4)).toEqual([1, 2, 3, 4]);
  });
});

describe('ListingPagination', () => {
  it('links page 1 without a page parameter and keeps the filters', () => {
    render(
      <ListingPagination
        locale="uk"
        path="/uk/catalog/ruchky"
        query={{ ...DEFAULT_LISTING_QUERY, inStock: true, page: 2 }}
        totalPages={3}
      />,
    );

    expect(screen.getByRole('link', { name: 'Сторінка 1' }).getAttribute('href')).toBe(
      '/uk/catalog/ruchky?inStock=true',
    );
    expect(screen.getByRole('link', { name: 'Сторінка 2' }).getAttribute('aria-current')).toBe(
      'page',
    );
    expect(screen.getByRole('link', { name: 'Наступна' }).getAttribute('href')).toBe(
      '/uk/catalog/ruchky?inStock=true&page=3',
    );
  });

  it('renders nothing for a single page', () => {
    const { container } = render(
      <ListingPagination
        locale="uk"
        path="/uk/catalog"
        query={DEFAULT_LISTING_QUERY}
        totalPages={1}
      />,
    );

    expect(container.innerHTML).toBe('');
  });
});
