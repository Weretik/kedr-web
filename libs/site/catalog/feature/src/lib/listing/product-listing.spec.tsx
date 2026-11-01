import { render, screen, within } from '@testing-library/react';

import { ProductListing } from './product-listing';

const { getProductListPage } = vi.hoisted(() => ({ getProductListPage: vi.fn() }));

vi.mock('@site/catalog/data-access', () => ({ getProductListPage }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }));
vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));

const product = {
  id: 7,
  sku: 7,
  slug: 'zavisa-agb',
  name: 'Завіса AGB',
  price: 245,
  photoUrl: null,
  inStock: true,
  isNew: false,
  isSale: false,
};

const renderListing = async (searchParams: Record<string, string>) =>
  render(
    await ProductListing({
      locale: 'uk',
      path: '/uk/catalog/zavisy',
      scope: { categoryId: 9 },
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
    });

    await renderListing({ inStock: 'true', sort: 'price-asc' });

    expect(getProductListPage).toHaveBeenCalledWith(
      'uk',
      { categoryId: 9 },
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

  it('says the products did not load when the API fails', async () => {
    getProductListPage.mockResolvedValue(null);

    await renderListing({});

    expect(screen.getByRole('status').textContent).toContain('тимчасово не завантажилися');
  });
});
