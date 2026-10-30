import { render, screen } from '@testing-library/react';

import { HomePage } from './home-page';

const { getCatalogSections, getInStockProducts } = vi.hoisted(() => ({
  getCatalogSections: vi.fn(),
  getInStockProducts: vi.fn(),
}));

vi.mock('@site/catalog/data-access', () => ({ getCatalogSections, getInStockProducts }));
vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));

const renderHome = async (locale: 'uk' | 'ru') => render(await HomePage({ locale }));

describe('HomePage', () => {
  it('composes the hero, catalog index, products in stock, and facts', async () => {
    getCatalogSections.mockResolvedValue([
      { id: 1, slug: 'zamki-900002', name: 'Замки', children: [] },
    ]);
    getInStockProducts.mockResolvedValue([
      {
        id: 7,
        slug: 'zavisa-agb',
        name: 'Завіса AGB',
        price: 245,
        photoUrl: null,
        isNew: false,
        isSale: false,
      },
    ]);

    await renderHome('uk');

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(
      screen.getByRole('heading', { level: 2, name: 'Каталог дверної фурнітури' }),
    ).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Замки' }).getAttribute('href')).toBe(
      '/uk/catalog/zamki-900002/products',
    );
    expect(screen.getByRole('heading', { level: 2, name: 'Є на складі' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Завіса AGB' })).toBeTruthy();
    expect(document.querySelector('script[type="application/ld+json"]')?.textContent).toContain(
      '"@type":"WebSite"',
    );
  });

  it('keeps the page useful when the catalog API is unavailable', async () => {
    getCatalogSections.mockResolvedValue(null);
    getInStockProducts.mockResolvedValue(null);

    await renderHome('ru');

    expect(screen.getByRole('status').textContent).toContain('Каталог временно не загрузился');
    expect(screen.queryByRole('heading', { name: 'Есть на складе' })).toBeNull();
    expect(screen.getByRole('heading', { level: 2, name: 'Почему Class Kedr' })).toBeTruthy();
  });
});
