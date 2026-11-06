import { render, screen, within } from '@testing-library/react';

import { ProductListing } from './product-listing';

const { getProductListPage } = vi.hoisted(() => ({ getProductListPage: vi.fn() }));

vi.mock('@site/catalog/data-access', () => ({ getProductListPage }));
const { redirect } = vi.hoisted(() => ({
  redirect: vi.fn(() => {
    throw new Error('NEXT_REDIRECT');
  }),
}));
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }), redirect }));
vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));

const product = {
  id: '7',
  sku: 7,
  slug: 'zavisa-agb',
  name: 'Завіса AGB',
  price: 245,
  photoUrl: null,
  inStock: true,
  isNew: false,
  isSale: false,
  variantCount: 1,
  colors: [],
};

const renderListing = async (searchParams: Record<string, string>) =>
  render(
    await ProductListing({
      locale: 'uk',
      path: '/uk/catalog/zavisy',
      scope: { categorySlug: 'zavisy' },
      searchParams: Promise.resolve(searchParams),
    }),
  );

describe('ProductListing', () => {
  it('shows filters, sort, products, the summary, page-size links, page links, and ItemList JSON-LD on an indexable page', async () => {
    getProductListPage.mockResolvedValue({
      items: [product],
      page: 1,
      pageSize: 20,
      totalPages: 2,
      totalRecords: 25,
      filters: [],
      exactMatch: null,
    });

    await renderListing({});

    expect(screen.getByRole('link', { name: 'Завіса AGB' })).toBeTruthy();
    expect(screen.getByText('Показано 1–1 з 25 товарів')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Сторінка 2' }).getAttribute('href')).toBe(
      '/uk/catalog/zavisy?page=2',
    );
    expect(screen.getByRole('complementary', { name: 'Фільтри' })).toBeTruthy();
    expect(screen.getByRole('combobox', { name: 'Сортування' })).toBeTruthy();
    expect(screen.getByRole('link', { name: '100 товарів на сторінці' }).getAttribute('href')).toBe(
      '/uk/catalog/zavisy?perPage=100',
    );
    expect(
      screen.getByRole('link', { name: '20 товарів на сторінці' }).getAttribute('aria-current'),
    ).toBe('true');
    expect(document.querySelector('script[type="application/ld+json"]')?.textContent).toContain(
      'ItemList',
    );
  });

  it('passes the parsed choices to the loader and leaves filtered pages without ItemList', async () => {
    getProductListPage.mockResolvedValue({
      items: [product],
      page: 1,
      pageSize: 20,
      totalPages: 1,
      totalRecords: 1,
      filters: [],
      exactMatch: null,
    });

    await renderListing({ inStock: 'true', sort: 'price-asc' });

    expect(getProductListPage).toHaveBeenCalledWith(
      'uk',
      { categorySlug: 'zavisy' },
      expect.objectContaining({ inStock: true, sort: 'price-asc', page: 1 }),
    );
    expect(document.querySelector('script[type="application/ld+json"]')).toBeNull();
  });

  it('offers a way back when filters exclude everything or the page is past the end', async () => {
    getProductListPage.mockResolvedValue({
      items: [],
      page: 1,
      pageSize: 20,
      totalPages: 0,
      totalRecords: 0,
    });
    const { unmount } = await renderListing({ isSale: 'true' });
    expect(
      within(screen.getByRole('status'))
        .getByRole('link', { name: 'Скинути фільтри' })
        .getAttribute('href'),
    ).toBe('/uk/catalog/zavisy');
    unmount();

    getProductListPage.mockResolvedValue({
      items: [],
      page: 9,
      pageSize: 20,
      totalPages: 2,
      totalRecords: 30,
    });
    await renderListing({ page: '9' });
    expect(screen.getByRole('link', { name: 'До першої сторінки' }).getAttribute('href')).toBe(
      '/uk/catalog/zavisy',
    );
  });

  it('shows a model with its variants and the attribute filters of a final category', async () => {
    getProductListPage.mockResolvedValue({
      items: [
        {
          ...product,
          id: 'zavisa-vrizna',
          slug: 'zavisa-vrizna',
          name: 'Завіса врізна',
          sku: null,
          variantCount: 4,
          colors: [{ slug: 'khrom', name: 'Хром', hex: '#c9ced3', textureUrl: null }],
        },
      ],
      page: 1,
      pageSize: 20,
      totalPages: 1,
      totalRecords: 1,
      filters: [
        {
          slug: 'kolir',
          name: 'Колір',
          display: 'swatch',
          values: [
            {
              slug: 'khrom',
              name: 'Хром',
              hex: '#c9ced3',
              textureUrl: null,
              count: 1,
              selected: true,
            },
          ],
        },
      ],
      exactMatch: null,
    });

    await renderListing({ kolir: 'khrom' });

    expect(getProductListPage).toHaveBeenCalledWith(
      'uk',
      { categorySlug: 'zavisy' },
      expect.objectContaining({ attributes: { kolir: ['khrom'] } }),
    );
    expect(screen.getByText('4 варіанти')).toBeTruthy();
    expect(screen.getAllByText(/від/).length).toBeGreaterThan(0);
    const color = within(screen.getByRole('complementary', { name: 'Фільтри' })).getByRole(
      'checkbox',
      { name: /Хром/ },
    ) as HTMLInputElement;
    expect([color.name, color.value, color.checked]).toEqual(['kolir', 'khrom', true]);
  });

  it('opens the model of an exact 1C code search with its product chosen', async () => {
    getProductListPage.mockResolvedValue({
      items: [],
      page: 1,
      pageSize: 20,
      totalPages: 0,
      totalRecords: 0,
      filters: [],
      exactMatch: { slug: 'zavisa-vrizna', selection: { kolir: 'khrom' } },
    });

    await expect(
      ProductListing({
        locale: 'uk',
        path: '/uk/search',
        scope: { searchTerm: '1201' },
        searchParams: Promise.resolve({ q: '1201' }),
        extra: { q: '1201' },
      }),
    ).rejects.toThrow('NEXT_REDIRECT');
    expect(redirect).toHaveBeenCalledWith('/uk/product/zavisa-vrizna?kolir=khrom');
  });

  it('says the products did not load when the API fails', async () => {
    getProductListPage.mockResolvedValue(null);

    await renderListing({});

    expect(screen.getByRole('status').textContent).toContain('тимчасово не завантажилися');
  });
});
