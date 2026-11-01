import { DEFAULT_LISTING_QUERY } from '@site/catalog/model';
import { fireEvent, render, screen } from '@testing-library/react';

import { ListingToolbar } from './listing-toolbar';

const push = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));

describe('ListingToolbar', () => {
  beforeEach(() => push.mockClear());

  it('sorts from page 1 and switches the view through the URL', () => {
    render(
      <ListingToolbar
        locale="uk"
        path="/uk/catalog/ruchky"
        query={{ ...DEFAULT_LISTING_QUERY, page: 3 }}
      />,
    );

    fireEvent.change(screen.getByRole('combobox', { name: 'Сортування' }), {
      target: { value: 'price-asc' },
    });
    expect(push).toHaveBeenCalledWith('/uk/catalog/ruchky?sort=price-asc', { scroll: false });
    expect(screen.getByRole('link', { name: 'Таблицею' }).getAttribute('href')).toBe(
      '/uk/catalog/ruchky?view=table&page=3',
    );
  });

  it('applies a flag at once, keeps sort, view, and page size, and starts from page 1', () => {
    render(
      <ListingToolbar
        locale="uk"
        path="/uk/catalog/ruchky"
        query={{
          ...DEFAULT_LISTING_QUERY,
          page: 3,
          sort: 'name',
          view: 'table',
          perPage: 100,
        }}
      />,
    );

    fireEvent.click(screen.getByRole('checkbox', { name: 'Тільки в наявності' }));

    expect(push).toHaveBeenCalledWith(
      '/uk/catalog/ruchky?inStock=true&sort=name&view=table&perPage=100',
      { scroll: false },
    );
  });

  it('applies the price range on submit and keeps the search term', () => {
    render(
      <ListingToolbar
        locale="uk"
        path="/uk/search"
        query={DEFAULT_LISTING_QUERY}
        extra={{ q: 'agb' }}
      />,
    );

    fireEvent.change(screen.getByRole('spinbutton', { name: 'від' }), { target: { value: '500' } });
    fireEvent.change(screen.getByRole('spinbutton', { name: 'до' }), { target: { value: '100' } });
    fireEvent.click(screen.getByRole('button', { name: 'Застосувати' }));

    expect(push).toHaveBeenCalledWith('/uk/search?q=agb&priceFrom=100&priceTo=500', {
      scroll: false,
    });
  });

  it('opens the filters from an icon and offers a filter reset', () => {
    render(
      <ListingToolbar
        locale="ru"
        path="/ru/catalog/ruchky"
        query={{ ...DEFAULT_LISTING_QUERY, isSale: true, sort: 'price-asc', page: 2 }}
      />,
    );

    const filters = screen.getByRole('button', { name: 'Фильтры' });
    fireEvent.click(filters);
    expect(filters.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByRole('link', { name: 'Сбросить фильтры' }).getAttribute('href')).toBe(
      '/ru/catalog/ruchky?sort=price-asc',
    );
  });
});
