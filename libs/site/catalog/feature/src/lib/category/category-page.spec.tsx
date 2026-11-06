import { render, screen } from '@testing-library/react';

import { CategoryPage, loadCategoryOrRespond } from './category-page';

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

const colorFilter = {
  code: 'color',
  slug: 'kolir',
  name: 'Колір',
  display: 'swatch',
  values: [
    { slug: 'khrom', name: 'Хром', hex: '#c9ced3', textureUrl: null, count: 12, selected: false },
    {
      slug: 'bile-zoloto',
      name: 'Біле золото',
      hex: null,
      textureUrl: null,
      count: 1,
      selected: false,
    },
  ],
};

const basePage = {
  items: [],
  page: 1,
  pageSize: 20,
  totalPages: 1,
  totalRecords: 13,
  filters: [colorFilter],
  exactMatch: null,
};

const tree = [
  {
    id: 1,
    slug: 'furnitura-dlia-dverei',
    name: 'Фурнітура для дверей',
    productCount: 5,
    children: [
      { id: 9, slug: 'ruchky', name: 'Ручки', productCount: 2, children: [] },
      { id: 10, slug: 'zamky', name: 'Замки', productCount: 3, children: [] },
    ],
  },
];

const category = {
  id: 9,
  slug: 'ruchky',
  name: 'Ручки',
  productCount: 2,
  breadcrumbs: [{ id: 9, slug: 'ruchky', name: 'Ручки' }],
  children: [],
  minPrice: null,
  maxPrice: null,
  content: {
    seoTitle: null,
    metaDescription: null,
    h1: 'Дверні ручки',
    bodyHtml: '<p>Опис</p>',
    faq: [],
  },
};

describe('loadCategoryOrRespond', () => {
  beforeEach(() => vi.clearAllMocks());

  it('redirects a moved slug permanently and answers 404 for a missing one', async () => {
    getCategory.mockResolvedValueOnce({ kind: 'moved', slug: 'ruchky-new' });
    await expect(loadCategoryOrRespond('uk', 'ruchky')).rejects.toThrow(
      'REDIRECT /uk/catalog/ruchky-new',
    );

    getCategory.mockResolvedValueOnce({ kind: 'moved', slug: 'ruchky-new' });
    await expect(
      loadCategoryOrRespond('uk', 'ruchky', Promise.resolve({ page: '2', sort: 'priceAsc' })),
    ).rejects.toThrow('REDIRECT /uk/catalog/ruchky-new?page=2&sort=priceAsc');

    getCategory.mockResolvedValueOnce({ kind: 'not-found' });
    await expect(loadCategoryOrRespond('uk', 'missing')).rejects.toThrow('NEXT_NOT_FOUND');
  });

  it('moves «Фурнітура» to the catalog hub and never shows Cosmos', async () => {
    getCategory.mockResolvedValueOnce({ kind: 'ok', category: { ...category, id: 5513 } });
    await expect(loadCategoryOrRespond('uk', 'furnitura')).rejects.toThrow('REDIRECT /uk/catalog');

    getCategory.mockResolvedValueOnce({ kind: 'ok', category: { ...category, id: 920000 } });
    await expect(loadCategoryOrRespond('uk', 'kosmos')).rejects.toThrow('NEXT_NOT_FOUND');
  });

  it('fails loudly when the API is unavailable and never calls it for the build placeholder', async () => {
    getCategory.mockResolvedValueOnce({ kind: 'unavailable' });
    await expect(loadCategoryOrRespond('uk', 'ruchky')).rejects.toThrow(
      'Catalog API is unavailable',
    );

    await expect(loadCategoryOrRespond('uk', '__placeholder__')).rejects.toThrow('NEXT_NOT_FOUND');
    expect(getCategory).toHaveBeenCalledTimes(1);
  });
});

describe('CategoryPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getCategory.mockResolvedValue({ kind: 'ok', category });
    getCatalogTree.mockResolvedValue(tree);
  });

  it('renders breadcrumbs, the admin H1, sibling chips, value links, text, and breadcrumb JSON-LD before the listing', async () => {
    getProductListPage
      .mockResolvedValueOnce(basePage)
      .mockReturnValue(new Promise(() => undefined));

    render(await CategoryPage({ locale: 'uk', slug: 'ruchky', searchParams: Promise.resolve({}) }));

    expect(screen.getByRole('heading', { level: 1, name: 'Дверні ручки' })).toBeTruthy();
    expect(screen.getByRole('navigation', { name: 'Ви тут' }).textContent).toContain('Каталог');
    expect(screen.getByRole('link', { name: /Замки/ }).getAttribute('href')).toBe(
      '/uk/catalog/zamky',
    );
    expect(screen.getByRole('link', { name: /Ручки/ }).getAttribute('aria-current')).toBe('page');
    expect(screen.getByRole('link', { name: /Хром/ }).getAttribute('href')).toBe(
      '/uk/catalog/ruchky/khrom',
    );
    expect(screen.queryByRole('link', { name: /Біле золото/ })).toBeNull();
    expect(screen.getByText('Опис')).toBeTruthy();
    expect(document.querySelector('script[type="application/ld+json"]')?.textContent).toContain(
      'BreadcrumbList',
    );
  });

  it('moves one color with its own page to that page, keeping the other choices', async () => {
    getProductListPage.mockResolvedValue(basePage);

    await expect(
      CategoryPage({
        locale: 'uk',
        slug: 'ruchky',
        searchParams: Promise.resolve({ kolir: 'khrom', sort: 'name' }),
      }),
    ).rejects.toThrow('REDIRECT /uk/catalog/ruchky/khrom?sort=name');
  });

  it('keeps a value without its own page and several choices in the query', async () => {
    getProductListPage
      .mockResolvedValueOnce(basePage)
      .mockReturnValue(new Promise(() => undefined));
    await CategoryPage({
      locale: 'uk',
      slug: 'ruchky',
      searchParams: Promise.resolve({ kolir: 'bile-zoloto' }),
    });

    getProductListPage
      .mockResolvedValueOnce(basePage)
      .mockReturnValue(new Promise(() => undefined));
    await CategoryPage({
      locale: 'uk',
      slug: 'ruchky',
      searchParams: Promise.resolve({ kolir: 'khrom', inStock: 'true' }),
    });

    expect(permanentRedirect).not.toHaveBeenCalled();
  });
});
