import type {
  ApiProductDetails,
  ApiProductListItem,
  ApiProductPage,
} from '../contracts/product.dto';

export const photoUrl = 'https://images-kedr.cdn.express/~/o/products/731.jpg';
export const schemeUrl = 'https://images-kedr.cdn.express/~/o/schemes/731.jpg';

/** `photos` follows an overridden `photo` unless the test sets it, as the backend keeps them in step. */
export const detailsFixture = (overrides: Partial<ApiProductDetails> = {}): ApiProductDetails => ({
  photos: overrides.photo === undefined ? [photoUrl] : overrides.photo ? [overrides.photo] : [],
  id: 731,
  name: ' Ручка на розеті ',
  productSlug: 'ruchka-731',
  price: 245.5,
  photo: photoUrl,
  scheme: schemeUrl,
  stock: 2,
  categoryName: ' Ручки ',
  categorySlug: 'ruchky',
  quantityInPack: 10,
  breadcrumbs: [
    { id: 5513, name: 'Фурнітура', slug: 'furnitura' },
    { id: 12, name: 'Ручки', slug: 'ruchky' },
  ],
  updatedAt: '2026-11-03T10:00:00Z',
  ...overrides,
});

export const listItemFixture = (id: number): ApiProductListItem => ({
  id,
  name: `Товар ${id}`,
  productSlug: `product-${id}`,
  photo: '',
  inStock: false,
  isSale: false,
  isNew: false,
  price: null,
});

export const pageFixture = (
  ids: number[],
  { number = 1, size = 100, total = ids.length } = {},
): ApiProductPage => ({
  value: ids.map(listItemFixture),
  pagedInfo: {
    pageNumber: number,
    pageSize: size,
    totalRecords: total,
    totalPages: Math.ceil(total / size),
  },
});
