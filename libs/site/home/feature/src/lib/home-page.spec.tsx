import { render, screen } from '@testing-library/react';

import { HomePage } from './home-page';

const { getCatalogSections } = vi.hoisted(() => ({ getCatalogSections: vi.fn() }));

vi.mock('@site/catalog/data-access', () => ({ getCatalogSections }));

const renderHome = async (locale: 'uk' | 'ru') => render(await HomePage({ locale }));

describe('HomePage', () => {
  it('composes the hero, catalog index, and facts without products', async () => {
    getCatalogSections.mockResolvedValue([
      { id: 1, slug: 'zamki-900002', name: 'Замки', children: [] },
    ]);
    await renderHome('uk');

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(
      screen.getByRole('heading', { level: 2, name: 'Каталог дверної фурнітури' }),
    ).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Замки' }).getAttribute('href')).toBe(
      '/uk/catalog/zamki-900002',
    );
    expect(screen.getByRole('search', { name: 'Пошук товару' }).getAttribute('action')).toBe(
      '/uk/search',
    );
    expect(screen.queryByRole('heading', { name: 'Є на складі' })).toBeNull();
    expect(document.querySelector('script[type="application/ld+json"]')?.textContent).toContain(
      '"@type":"WebSite"',
    );
  });

  it('keeps the page useful when the catalog API is unavailable', async () => {
    getCatalogSections.mockResolvedValue(null);

    await renderHome('ru');

    expect(screen.getByRole('status').textContent).toContain('Каталог временно не загрузился');
    expect(screen.getByRole('heading', { level: 2, name: 'Почему Class Kedr' })).toBeTruthy();
  });
});
