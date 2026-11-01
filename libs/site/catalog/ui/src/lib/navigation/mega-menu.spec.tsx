import { fireEvent, render, screen, within } from '@testing-library/react';

import { MegaMenu } from './mega-menu';

const tree = [
  {
    id: 1,
    slug: 'ruchky',
    name: 'Ручки',
    productCount: 10,
    children: [
      {
        id: 2,
        slug: 'na-rozetsi',
        name: 'На розетці',
        productCount: 4,
        children: [{ id: 5, slug: 'chorni', name: 'Чорні', productCount: 2, children: [] }],
      },
    ],
  },
  { id: 3, slug: 'dveri', name: 'Двері', productCount: 7, children: [] },
];

const renderMenu = () =>
  render(
    <MegaMenu
      locale="uk"
      tree={[tree[1], tree[0]]}
      catalogPath="/catalog"
      wholesalePath="/wholesale"
      separateIds={[3]}
    />,
  );

describe('MegaMenu', () => {
  it('keeps every section link in the HTML while closed', () => {
    const { container } = renderMenu();

    const hrefs = [...container.querySelectorAll('a')].map((link) => link.getAttribute('href'));
    expect(hrefs).toEqual(
      expect.arrayContaining([
        '/uk/catalog/ruchky',
        '/uk/catalog/na-rozetsi',
        '/uk/catalog/chorni',
        '/uk/catalog/dveri',
      ]),
    );
    expect(screen.getByRole('button', { name: 'Каталог' }).getAttribute('aria-expanded')).toBe(
      'false',
    );
  });

  it('opens, switches sections on hover, and closes on Escape', () => {
    renderMenu();

    fireEvent.click(screen.getByRole('button', { name: 'Каталог' }));
    const region = screen.getByRole('region', { name: 'Каталог товарів' });
    const rail = within(region).getAllByRole('list')[0] as HTMLElement;
    expect(
      within(rail)
        .getAllByRole('link')
        .map((link) => link.textContent),
    ).toEqual(['Ручки10', 'Двері7']);
    expect(screen.getByRole('link', { name: 'На розетці' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Усі товари розділу' }).getAttribute('href')).toBe(
      '/uk/catalog/ruchky',
    );

    fireEvent.mouseEnter(screen.getByRole('link', { name: /Двері/ }));
    expect(screen.queryByRole('link', { name: 'На розетці' })).toBeNull();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.getByRole('button', { name: 'Каталог' }).getAttribute('aria-expanded')).toBe(
      'false',
    );
  });

  it('finds categories at any depth with their path', () => {
    renderMenu();
    fireEvent.click(screen.getByRole('button', { name: 'Каталог' }));

    fireEvent.change(screen.getByRole('searchbox', { name: 'Пошук категорії' }), {
      target: { value: 'чорн' },
    });

    const result = screen.getByRole('link', { name: /Чорні/ });
    expect(result.getAttribute('href')).toBe('/uk/catalog/chorni');
    expect(result.textContent).toContain('Ручки › На розетці');
  });
});
