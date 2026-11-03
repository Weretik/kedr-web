import { mapProductDetails } from './product-details.mapper';
import { detailsFixture, photoUrl, schemeUrl } from '../testing/product-fixtures';

describe('mapProductDetails', () => {
  it('preserves real identity and represents unknown retail price without inventing zero', () => {
    expect(mapProductDetails(detailsFixture({ price: null }))).toMatchObject({
      sku: '731',
      name: 'Ручка на розеті',
      price: null,
      inStock: true,
    });
  });

  it('normalizes facts and leaves hidden root filtering to feature composition', () => {
    expect(mapProductDetails(detailsFixture())).toEqual({
      sku: '731',
      slug: 'ruchka-731',
      name: 'Ручка на розеті',
      price: 245.5,
      inStock: true,
      quantityInPack: 10,
      categoryName: 'Ручки',
      categorySlug: 'ruchky',
      breadcrumbs: [
        { id: 5513, name: 'Фурнітура', slug: 'furnitura' },
        { id: 12, name: 'Ручки', slug: 'ruchky' },
      ],
      media: [
        { kind: 'photo', url: photoUrl },
        { kind: 'scheme', url: schemeUrl },
      ],
      updatedAt: '2026-11-03T10:00:00Z',
    });
  });

  it.each([null, undefined, 0, -1, Number.NaN, Number.POSITIVE_INFINITY])(
    'maps invalid price %s to a request independently of stock',
    (price) => {
      expect(mapProductDetails(detailsFixture({ price }))).toMatchObject({
        price: null,
        inStock: true,
      });
    },
  );

  it.each([0, -1, Number.NaN, Number.POSITIVE_INFINITY])(
    'does not advertise invalid stock %s',
    (stock) => {
      expect(mapProductDetails(detailsFixture({ stock }))).toMatchObject({
        inStock: false,
        price: 245.5,
      });
    },
  );

  it.each([0, -1, 1.5, Number.POSITIVE_INFINITY])(
    'omits an invalid informational pack %s',
    (quantityInPack) => {
      expect(mapProductDetails(detailsFixture({ quantityInPack }))).toMatchObject({
        quantityInPack: null,
      });
    },
  );

  it.each([
    { id: 0 },
    { id: 1.5 },
    { name: '  ' },
    { productSlug: '../catalog' },
    { productSlug: '%2fadmin' },
  ])('rejects invalid mandatory identity %o', (overrides) => {
    expect(mapProductDetails(detailsFixture(overrides))).toBeNull();
  });

  it.each([
    ['http://images-kedr.cdn.express/a.jpg', ''],
    ['https://other.example/a.jpg', ''],
    ['https://user:pass@images-kedr.cdn.express/a.jpg', ''],
    ['', 'javascript:alert(1)'],
  ])('rejects unsafe media without fabricating an image (%s)', (photo, scheme) => {
    expect(mapProductDetails(detailsFixture({ photo, scheme }))?.media).toEqual([]);
  });

  it('keeps a valid scheme when the main photo is absent', () => {
    expect(mapProductDetails(detailsFixture({ photo: '' }))?.media).toEqual([
      { kind: 'scheme', url: schemeUrl },
    ]);
  });

  it('deduplicates photo and scheme that refer to the same fetch URL', () => {
    expect(mapProductDetails(detailsFixture({ scheme: photoUrl + '#scheme' }))?.media).toEqual([
      { kind: 'photo', url: photoUrl },
    ]);
  });

  it('omits broken category links and retains unique original breadcrumbs', () => {
    expect(
      mapProductDetails(
        detailsFixture({
          categorySlug: '../bad',
          categoryName: '  ',
          breadcrumbs: [
            { id: 12, name: ' Ручки ', slug: 'ruchky' },
            { id: 12, name: 'Дублікат', slug: 'duplicate' },
            { id: 13, name: 'Дублікат', slug: 'ruchky' },
            { id: 14, name: ' ', slug: 'empty' },
            { id: 15, name: 'Помилка', slug: '/invalid' },
          ],
        }),
      ),
    ).toMatchObject({
      categoryName: '',
      categorySlug: null,
      breadcrumbs: [{ id: 12, name: 'Ручки', slug: 'ruchky' }],
    });
  });

  it.each(['not-a-date', '2026-02-30T10:00:00Z', ''])(
    'does not invent a source date from %s',
    (updatedAt) => {
      expect(mapProductDetails(detailsFixture({ updatedAt }))?.updatedAt).toBeNull();
    },
  );
});
