import { getProductListPage } from '@site/catalog/data-access';
import { getProductDetails, getSiteModel } from '@site/product/data-access';
import { renderToStaticMarkup } from 'react-dom/server';

import { getModelMetadata } from './model-metadata';
import { ModelPage } from './model-page';
import { productFixture } from '../../test/product.fixture';

import type { ProductSummary } from '@site/catalog/model';
import type { SiteModel } from '@site/product/model';

vi.mock('@site/product/data-access', () => ({ getProductDetails: vi.fn(), getSiteModel: vi.fn() }));
vi.mock('@site/catalog/data-access', () => ({ getProductListPage: vi.fn() }));
vi.mock('@site/shared/company', () => ({
  getCompanyContacts: vi.fn(async () => ({
    phone: { display: '(067) 111-22-33', e164: '+380671112233' },
  })),
}));
vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));
vi.mock('next/navigation', () => ({
  notFound: () => {
    throw new Error('NOT_FOUND_404');
  },
  permanentRedirect: (url: string) => {
    throw new Error(`MOVED_308:${url}`);
  },
}));

const variant = (sku: string, color: string, inStock: boolean, isMain = false) => ({
  sku,
  name: `Завіса FLUSH ${color}`,
  slug: `zavisa-${sku}`,
  photoUrl: null,
  price: 65.7,
  inStock,
  isMain,
  selection: { kolir: color },
});

const model: SiteModel = {
  slug: 'zavisa-flush',
  name: 'Завіса KEDR FLUSH',
  isAccepted: true,
  categorySlug: 'zavisy',
  texts: {
    shortDescription: 'Прихована завіса',
    description: 'Повний опис моделі',
    seoTitle: 'Завіси FLUSH купити',
    seoDescription: '',
  },
  mainProductSlug: 'zavisa-1',
  axes: [
    {
      slug: 'kolir',
      name: 'Колір',
      display: 'button',
      values: [
        { key: 'khrom', name: 'Хром', hex: null, textureUrl: null },
        { key: 'zoloto', name: 'Золото', hex: null, textureUrl: null },
      ],
    },
  ],
  products: [variant('1', 'khrom', true, true), variant('2', 'zoloto', false)],
  characteristics: [{ name: 'Матеріал', values: ['Сталь'] }],
};

const other: ProductSummary = {
  id: 'zavisa-inша',
  sku: null,
  slug: 'zavisa-insha',
  name: 'Інша завіса',
  photo: null,
  price: 50,
  inStock: true,
  isSale: false,
  isNew: false,
  variantCount: 2,
  colors: [],
} as unknown as ProductSummary;

beforeEach(() => {
  vi.mocked(getSiteModel).mockResolvedValue({ kind: 'ok', model });
  vi.mocked(getProductListPage).mockResolvedValue({
    items: [other, { ...other, id: 'self', slug: 'zavisa-flush' }],
  } as never);
  vi.mocked(getProductDetails).mockImplementation(async (_locale, slug) => ({
    kind: 'ok',
    product: {
      ...productFixture,
      sku: slug.replace('zavisa-', ''),
      slug,
      name: slug === 'zavisa-2' ? 'Завіса FLUSH zoloto' : 'Завіса FLUSH khrom',
      inStock: slug !== 'zavisa-2',
    },
  }));
});

describe('ModelPage', () => {
  it('shows the main variant under the model name with switchers, variants, texts and other models', async () => {
    const renderVariantsAction = vi.fn(() => <div>Variants table</div>);
    const html = renderToStaticMarkup(
      await ModelPage({
        locale: 'uk',
        slug: 'zavisa-flush',
        searchParams: {},
        renderVariantsAction,
      }),
    );

    expect(getProductDetails).toHaveBeenCalledWith('uk', 'zavisa-1');
    expect(html).toContain('Завіса KEDR FLUSH</h1>');
    expect(html).toContain('Прихована завіса');
    expect(html).toContain('href="/uk/product/zavisa-flush?kolir=zoloto"');
    expect(html).toContain('Variants table');
    expect(html).toContain('Повний опис моделі');
    expect(html).toContain('Матеріал');
    expect(html).toContain('Інші моделі в категорії');
    expect(html).toContain('Інша завіса');
    expect(html).not.toContain('Є в наявності:');
    expect(renderVariantsAction).toHaveBeenCalledWith([
      expect.objectContaining({ productId: '1', details: 'Хром', current: true, available: true }),
      expect.objectContaining({
        productId: '2',
        details: 'Золото',
        current: false,
        available: false,
      }),
    ]);
  });

  it('opens the variant of the query and offers in-stock variants when it is out of stock', async () => {
    const html = renderToStaticMarkup(
      await ModelPage({ locale: 'uk', slug: 'zavisa-flush', searchParams: { kolir: 'zoloto' } }),
    );
    expect(getProductDetails).toHaveBeenCalledWith('uk', 'zavisa-2');
    expect(html).toContain('Є в наявності:');
    expect(html).toContain('href="/uk/product/zavisa-flush?kolir=khrom"');
  });

  it('answers 308 to the model for a product inside it', async () => {
    vi.mocked(getSiteModel).mockResolvedValue({
      kind: 'moved',
      modelSlug: 'zavisa-flush',
      selection: { kolir: 'zoloto' },
    });
    await expect(ModelPage({ locale: 'ru', slug: 'zavisa-2', searchParams: {} })).rejects.toThrow(
      'MOVED_308:/ru/product/zavisa-flush?kolir=zoloto',
    );
  });

  it('keeps the product page for a product shown as a model of its own', async () => {
    vi.mocked(getSiteModel).mockResolvedValue({
      kind: 'ok',
      model: { ...model, isAccepted: false, slug: 'handle-7' },
    });
    vi.mocked(getProductDetails).mockResolvedValue({ kind: 'ok', product: productFixture });
    const html = renderToStaticMarkup(
      await ModelPage({ locale: 'uk', slug: 'handle-7', searchParams: {} }),
    );
    expect(html).toContain('Дверна ручка</h1>');
    expect(html).not.toContain('Інші моделі в категорії');
  });

  it('builds canonical metadata from the model texts without the query', async () => {
    const metadata = await getModelMetadata('uk', 'zavisa-flush');
    expect(metadata.title).toBe('Завіси FLUSH купити');
    expect(metadata.description).toBe('Прихована завіса');
    expect(String(metadata.alternates?.canonical)).toMatch(/\/uk\/product\/zavisa-flush$/);
  });
});
