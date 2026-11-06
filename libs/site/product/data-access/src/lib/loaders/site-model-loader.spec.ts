import { getSiteModel } from './site-model-loader';

const { siteApiGet, cacheLife, cacheTag } = vi.hoisted(() => ({
  siteApiGet: vi.fn(),
  cacheLife: vi.fn(),
  cacheTag: vi.fn(),
}));
vi.mock('server-only', () => ({}));
vi.mock('next/cache', () => ({ cacheLife, cacheTag }));
vi.mock('@site/shared/api-client', () => ({ siteApiGet }));

const modelDto = {
  slug: 'zavisa-flush',
  name: 'Завіса FLUSH',
  isAccepted: true,
  category: { id: 7, slug: 'zavisy', name: 'Завіси' },
  breadcrumbs: [],
  texts: { shortDescription: ' Коротко ', description: '', seoTitle: 'SEO', seoDescription: '' },
  mainProductSlug: 'zavisa-1',
  axes: [
    {
      code: 'color',
      slug: 'kolir',
      name: 'Колір',
      display: 'swatch',
      values: [
        { key: 'khrom', name: 'Хром', hex: '#C9CED3', textureUrl: 'https://evil.example/t.png' },
      ],
    },
  ],
  products: [
    {
      id: 26905,
      name: 'Завіса хром',
      slug: 'zavisa-1',
      photo: 'https://images-kedr.cdn.express/p/1.jpg',
      price: 65.7,
      inStock: true,
      isSale: false,
      isNew: false,
      isMain: true,
      selection: { kolir: 'khrom' },
    },
    {
      ...{ id: 2, name: 'x', slug: 'bad/slug', photo: '', price: 0 },
      inStock: false,
      isSale: false,
      isNew: false,
      isMain: false,
      selection: {},
    },
  ],
  characteristics: [
    { code: 'material', name: 'Матеріал', values: ['Сталь'] },
    { code: 'empty', name: 'Порожня', values: [' '] },
  ],
};

describe('getSiteModel', () => {
  beforeEach(() => vi.resetAllMocks());

  it('maps the model page and caches it by slug', async () => {
    siteApiGet.mockResolvedValue({ kind: 'ok', data: modelDto });
    const result = await getSiteModel('uk', 'zavisa-flush');
    expect(siteApiGet).toHaveBeenCalledWith('/api/catalog/{lang}/model/{modelSlug}', {
      path: { lang: 'uk', modelSlug: 'zavisa-flush' },
    });
    expect(result).toEqual({
      kind: 'ok',
      model: {
        slug: 'zavisa-flush',
        name: 'Завіса FLUSH',
        isAccepted: true,
        categorySlug: 'zavisy',
        texts: {
          shortDescription: 'Коротко',
          description: '',
          seoTitle: 'SEO',
          seoDescription: '',
        },
        mainProductSlug: 'zavisa-1',
        axes: [
          {
            code: 'color',
            slug: 'kolir',
            name: 'Колір',
            display: 'swatch',
            values: [{ key: 'khrom', name: 'Хром', hex: '#C9CED3', textureUrl: null }],
          },
        ],
        products: [
          {
            sku: '26905',
            name: 'Завіса хром',
            slug: 'zavisa-1',
            photoUrl: 'https://images-kedr.cdn.express/p/1.jpg',
            price: 65.7,
            inStock: true,
            isMain: true,
            selection: { kolir: 'khrom' },
          },
        ],
        characteristics: [{ name: 'Матеріал', values: ['Сталь'] }],
      },
    });
    expect(cacheTag.mock.calls.flat()).toEqual(
      expect.arrayContaining(['catalog', 'catalog:models', 'product:slug:zavisa-flush']),
    );
    expect(cacheLife).toHaveBeenCalledWith('hours');
  });

  it('returns the model address of a product inside an accepted model', async () => {
    siteApiGet.mockResolvedValue({
      kind: 'not-found',
      body: { modelSlug: 'zavisa-flush', categorySlug: 'zavisy', selection: { kolir: 'khrom' } },
    });
    expect(await getSiteModel('uk', 'zavisa-1')).toEqual({
      kind: 'moved',
      modelSlug: 'zavisa-flush',
      selection: { kolir: 'khrom' },
    });
  });

  it('tells a missing model from an unavailable API', async () => {
    siteApiGet.mockResolvedValueOnce({ kind: 'not-found' });
    expect(await getSiteModel('uk', 'nemaye')).toEqual({ kind: 'not-found' });
    siteApiGet.mockResolvedValueOnce({ kind: 'unavailable', status: 503 });
    expect(await getSiteModel('uk', 'zavisa-flush')).toEqual({ kind: 'unavailable' });
    expect(await getSiteModel('uk', '../x')).toEqual({ kind: 'not-found' });
    expect(siteApiGet).toHaveBeenCalledTimes(2);
  });
});
