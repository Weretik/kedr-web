import { mapPublicProductDetails } from './catalog-product-details.mapper';

import type { PublicProductDetailsDto } from '../contracts/public-product-details.dto';

const dto: PublicProductDetailsDto = {
  breadcrumbs: [{ id: 2, name: 'Категорія', slug: 'category' }],
  categoryName: 'Категорія',
  categorySlug: 'category',
  id: 42,
  name: 'Товар',
  photo: ' https://example.com/photo.jpg ',
  price: 123.5,
  quantityInPack: 4,
  scheme: '',
  stock: 10,
};

describe('mapPublicProductDetails', () => {
  it('maps every API field and normalizes optional media', () => {
    expect(mapPublicProductDetails(dto)).toEqual({
      breadcrumbs: [{ id: '2', name: 'Категорія', slug: 'category' }],
      categoryName: 'Категорія',
      categorySlug: 'category',
      id: '42',
      imageUrl: 'https://example.com/photo.jpg',
      name: 'Товар',
      price: 123.5,
      quantityInPack: 4,
      schemeUrl: null,
      stock: 10,
    });
  });

  it('rejects a response that no longer matches the runtime contract', () => {
    expect(() => mapPublicProductDetails({ ...dto, stock: '10' } as never)).toThrow();
  });
});
