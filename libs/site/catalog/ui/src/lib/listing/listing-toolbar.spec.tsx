import { DEFAULT_LISTING_QUERY } from '@site/catalog/model';
import { fireEvent, render, screen } from '@testing-library/react';

import { ListingToolbar } from './listing-toolbar';

const push = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));

describe('ListingToolbar', () => {
  beforeEach(() => push.mockClear());

  it('applies a flag at once and starts from page 1', () => {
    render(
      <ListingToolbar
        locale="uk"
        path="/uk/catalog/ruchky"
        query={{ ...DEFAULT_LISTING_QUERY, page: 3 }}
      />,
    );

    fireEvent.click(screen.getByRole('checkbox', { name: 'Тільки в наявності' }));

    expect(push).toHaveBeenCalledWith('/uk/catalog/ruchky?inStock=true', { scroll: false });
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

  it('offers a reset link and view links only through the URL', () => {
    render(
      <ListingToolbar
        locale="ru"
        path="/ru/catalog/ruchky"
        query={{ ...DEFAULT_LISTING_QUERY, isSale: true, sort: 'price-asc' }}
      />,
    );

    expect(screen.getByRole('link', { name: 'Сбросить фильтры' }).getAttribute('href')).toBe(
      '/ru/catalog/ruchky?sort=price-asc',
    );
    expect(screen.getByRole('link', { name: 'Таблицей' }).getAttribute('href')).toBe(
      '/ru/catalog/ruchky?isSale=true&sort=price-asc&view=table',
    );
  });
});
