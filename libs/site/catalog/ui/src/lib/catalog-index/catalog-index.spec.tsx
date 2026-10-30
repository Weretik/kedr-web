import { render, screen, within } from '@testing-library/react';

import { CatalogIndex } from './catalog-index';

import type { CatalogSection } from '@site/catalog/model';

const children = Array.from({ length: 12 }, (_, index) => ({
  id: 100 + index,
  slug: `child-${index + 1}`,
  name: `Підкатегорія ${index + 1}`,
}));

const sections: CatalogSection[] = [
  { id: 1, slug: 'zamki-900002', name: 'Замки', children },
  { id: 2, slug: 'inshe-900006', name: 'Інше', children: [] },
];

describe('CatalogIndex', () => {
  it('links every section and its first eight subcategories, then the whole category', () => {
    render(<CatalogIndex locale="uk" sections={sections} />);

    const locks = screen.getByRole('heading', { name: 'Замки' }).closest('li') as HTMLElement;
    const links = within(locks).getAllByRole('link');
    expect(links[0]?.getAttribute('href')).toBe('/uk/catalog/zamki-900002/products');
    expect(within(locks).getByRole('link', { name: 'Підкатегорія 8' }).getAttribute('href')).toBe(
      '/uk/catalog/child-8/products',
    );
    expect(within(locks).queryByRole('link', { name: 'Підкатегорія 9' })).toBeNull();
    expect(within(locks).getByRole('link', { name: 'Усі 12 →' }).getAttribute('href')).toBe(
      '/uk/catalog/zamki-900002/products',
    );
  });

  it('shows a section without subcategories as a single link', () => {
    render(<CatalogIndex locale="ru" sections={sections} />);

    const other = screen.getByRole('heading', { name: 'Інше' }).closest('li') as HTMLElement;
    expect(within(other).getAllByRole('link')).toHaveLength(1);
  });
});
