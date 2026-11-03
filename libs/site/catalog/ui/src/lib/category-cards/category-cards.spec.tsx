import { render, screen, within } from '@testing-library/react';

import { CategoryCards } from './category-cards';

const leaf = (id: number, name: string) => ({
  id,
  slug: `c-${id}`,
  name,
  productCount: 1,
  children: [],
});

describe('CategoryCards', () => {
  it.each(['uk', 'ru'] as const)(
    'renders compact category links for %s without secondary data',
    (locale) => {
      const { container } = render(
        <CategoryCards
          locale={locale}
          variant="compact"
          categories={[
            {
              id: 900001,
              slug: 'завіси та петлі',
              name: 'Завіси',
              productCount: 75,
              children: [leaf(1, 'Приховані')],
            },
            {
              id: 42,
              slug: 'other',
              name: 'Інше',
              productCount: 3,
              children: [],
            },
          ]}
        />,
      );

      expect(screen.getByRole('link', { name: 'Завіси' }).getAttribute('href')).toBe(
        `/${locale}/catalog/${encodeURIComponent('завіси та петлі')}`,
      );
      expect(screen.getAllByRole('link')).toHaveLength(2);
      expect(screen.queryByText('Приховані')).toBeNull();
      expect(screen.queryByText(/75/)).toBeNull();
      const photo = container.querySelector('img[src*="hinges"]');
      expect(photo).toBeTruthy();
      expect(photo?.getAttribute('alt')).toBe('');
      const fallback = screen.getByRole('link', { name: 'Інше' });
      expect(fallback.querySelector('img')).toBeNull();
      expect(fallback.querySelector('svg[aria-hidden="true"]')).toBeTruthy();
    },
  );

  it('shows a photo card per category with its count and first subcategories', () => {
    const { container } = render(
      <CategoryCards
        locale="uk"
        categories={[
          {
            id: 900001,
            slug: 'zavisy',
            name: 'Завіси',
            productCount: 75,
            children: [1, 2, 3, 4, 5, 6].map((id) => leaf(id, `Підкатегорія ${id}`)),
          },
          {
            id: 42,
            slug: 'inshe',
            name: 'Інше',
            productCount: 3,
            children: [],
          },
        ]}
      />,
    );

    const card = screen.getByRole('heading', { name: 'Завіси' }).closest('li') as HTMLElement;
    expect(within(card).getByText('75 товарів')).toBeTruthy();
    expect(within(card).getByRole('link', { name: 'Підкатегорія 5' })).toBeTruthy();
    expect(within(card).queryByRole('link', { name: 'Підкатегорія 6' })).toBeNull();
    expect(within(card).getByRole('link', { name: /Усі 6/ }).getAttribute('href')).toBe(
      '/uk/catalog/zavisy',
    );
    expect(container.querySelector('img[src*="hinges"]')).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Інше' })).toBeTruthy();
  });
});
