import { mapModelCard, mapModelListPage } from './model-list-page.mapper';
import { toProductPhotoUrl } from './photo-url';

const card = {
  slug: 'zavisa-vrizna-100',
  name: ' Завіса врізна 100 ',
  categorySlug: 'zavisy',
  photo: 'https://images-kedr.cdn.express/~/o/products/7.jpg',
  priceFrom: 185,
  inStock: true,
  isSale: false,
  isNew: true,
  productCount: 3,
  isAccepted: true,
  colors: [
    { slug: 'khrom', name: 'Хром', hex: '#C9CED3', textureUrl: null },
    { slug: 'dub', name: 'Дуб', hex: 'oak', textureUrl: 'https://evil.example/t.jpg' },
  ],
  productId: null,
};

describe('mapModelCard', () => {
  it('maps a model of several products to a card with variants and colors', () => {
    expect(mapModelCard(card)).toEqual({
      id: 'zavisa-vrizna-100',
      sku: null,
      slug: 'zavisa-vrizna-100',
      name: 'Завіса врізна 100',
      price: 185,
      variantCount: 3,
      colors: [
        { slug: 'khrom', name: 'Хром', hex: '#C9CED3', textureUrl: null },
        { slug: 'dub', name: 'Дуб', hex: null, textureUrl: null },
      ],
      photoUrl: 'https://images-kedr.cdn.express/~/o/products/7.jpg',
      inStock: true,
      isNew: true,
      isSale: false,
    });
  });

  it('gives a one-product model the article of its product and treats zero price as on request', () => {
    const own = mapModelCard({
      ...card,
      productCount: 1,
      productId: 4417,
      priceFrom: 0,
      colors: [],
    });
    expect([own.sku, own.price, own.variantCount]).toEqual([4417, null, 1]);
  });
});

describe('mapModelListPage', () => {
  it('keeps filters with values and the exact match address', () => {
    const page = mapModelListPage({
      categorySlug: 'zavisy',
      isFinalCategory: true,
      page: 1,
      pageSize: 20,
      totalPages: 1,
      totalRecords: 1,
      items: [card],
      filters: [
        {
          code: 'color',
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
        { code: 'size', slug: 'rozmir', name: 'Розмір', display: 'button', values: [] },
      ],
      exactMatch: {
        modelSlug: 'zavisa-vrizna-100',
        categorySlug: 'zavisy',
        selection: { kolir: 'khrom' },
      },
    });

    expect(page.filters).toEqual([
      {
        code: 'color',
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
    ]);
    expect(page.exactMatch).toEqual({ slug: 'zavisa-vrizna-100', selection: { kolir: 'khrom' } });
  });
});

describe('toProductPhotoUrl', () => {
  it('keeps only HTTPS photos on the image CDN', () => {
    expect(toProductPhotoUrl('')).toBeNull();
    expect(toProductPhotoUrl('not a url')).toBeNull();
    expect(toProductPhotoUrl('http://images-kedr.cdn.express/a.jpg')).toBeNull();
    expect(toProductPhotoUrl('https://evil.example/a.jpg')).toBeNull();
  });
});
