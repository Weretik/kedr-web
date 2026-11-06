import { render, screen } from '@testing-library/react';

import { CategoryValuePage, loadLandingOrRespond } from './landing-page';

const { getCategory, getCatalogTree, getProductListPage, notFound, permanentRedirect } = vi.hoisted(
  () => ({
    getCategory: vi.fn(),
    getCatalogTree: vi.fn(),
    getProductListPage: vi.fn(),
    notFound: vi.fn(() => {
      throw new Error('NEXT_NOT_FOUND');
    }),
    permanentRedirect: vi.fn((url: string) => {
      throw new Error(`REDIRECT ${url}`);
    }),
  }),
);

vi.mock('@site/catalog/data-access', () => ({ getCategory, getCatalogTree, getProductListPage }));
vi.mock('next/navigation', () => ({
  notFound,
  permanentRedirect,
  useRouter: () => ({ push: vi.fn() }),
}));

const swatch = (slug: string, name: string, count: number) => ({
  slug,
  name,
  hex: '#c9ced3',
  textureUrl: null,
  count,
  selected: false,
});

const basePage = {
  items: [],
  page: 1,
  pageSize: 20,
  totalPages: 1,
  totalRecords: 21,
  filters: [
    {
      code: 'color',
      slug: 'kolir',
      name: 'Колір',
      display: 'swatch',
      values: [swatch('khrom', 'Хром', 12), swatch('zoloto', 'Золото', 9)],
    },
  ],
  exactMatch: null,
};

const category = {
  id: 4,
  slug: 'zavisy',
  name: 'Завіси',
  productCount: 30,
  breadcrumbs: [{ id: 4, slug: 'zavisy', name: 'Завіси' }],
  children: [],
  minPrice: null,
  maxPrice: null,
  content: {
    seoTitle: null,
    metaDescription: null,
    h1: null,
    bodyHtml: '<p>Текст категорії</p>',
    faq: [],
  },
};

describe('loadLandingOrRespond', () => {
  beforeEach(() => vi.clearAllMocks());

  it('moves a renamed category to its new value page with the query', async () => {
    getCategory.mockResolvedValue({ kind: 'moved', slug: 'zavisy-new' });
    await expect(
      loadLandingOrRespond('uk', 'zavisy', 'khrom', Promise.resolve({ sort: 'name' })),
    ).rejects.toThrow('REDIRECT /uk/catalog/zavisy-new/khrom?sort=name');
  });

  it('answers 404 for an unknown value and a category with subcategories', async () => {
    getCategory.mockResolvedValue({ kind: 'ok', category });
    getProductListPage.mockResolvedValue(basePage);
    await expect(loadLandingOrRespond('uk', 'zavisy', 'liva')).rejects.toThrow('NEXT_NOT_FOUND');

    getCategory.mockResolvedValue({
      kind: 'ok',
      category: {
        ...category,
        children: [{ id: 5, slug: 'x', name: 'X', productCount: 1, children: [] }],
      },
    });
    await expect(loadLandingOrRespond('uk', 'zavisy', 'khrom')).rejects.toThrow('NEXT_NOT_FOUND');
  });

  it('fails loudly when the list is unavailable', async () => {
    getCategory.mockResolvedValue({ kind: 'ok', category });
    getProductListPage.mockResolvedValue(null);
    await expect(loadLandingOrRespond('uk', 'zavisy', 'khrom')).rejects.toThrow('unavailable');
  });
});

describe('CategoryValuePage', () => {
  it('renders the value trail, the automatic heading and line, and links to the other values', async () => {
    getCategory.mockResolvedValue({ kind: 'ok', category });
    getCatalogTree.mockResolvedValue([]);
    getProductListPage
      .mockResolvedValueOnce(basePage)
      .mockReturnValue(new Promise(() => undefined));

    render(
      await CategoryValuePage({
        locale: 'uk',
        slug: 'zavisy',
        value: 'khrom',
        searchParams: Promise.resolve({}),
      }),
    );

    expect(screen.getByRole('heading', { level: 1, name: 'Завіси хром' })).toBeTruthy();
    expect(
      screen.getByText('Завіси хром: 12 моделей. Продаємо оптом і в роздріб, доставка по Україні.'),
    ).toBeTruthy();
    expect(screen.getByRole('navigation', { name: 'Ви тут' }).textContent).toContain('Хром');
    expect(screen.getByRole('link', { name: /Хром/ }).getAttribute('aria-current')).toBe('page');
    expect(screen.getByRole('link', { name: /Золото/ }).getAttribute('href')).toBe(
      '/uk/catalog/zavisy/zoloto',
    );
    expect(screen.getByRole('link', { name: 'Усі' }).getAttribute('href')).toBe(
      '/uk/catalog/zavisy',
    );
    expect(screen.queryByText('Текст категорії')).toBeNull();
    expect(document.querySelector('script[type="application/ld+json"]')?.textContent).toContain(
      '/uk/catalog/zavisy/khrom',
    );
  });
});
