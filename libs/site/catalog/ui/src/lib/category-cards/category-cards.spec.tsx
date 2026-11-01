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
          { id: 42, slug: 'inshe', name: 'Інше', productCount: 3, children: [] },
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
