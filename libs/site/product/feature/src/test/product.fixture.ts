import type { ProductDetails } from '@site/product/model';

export const productFixture: ProductDetails = {
  sku: '7',
  slug: 'handle-7',
  name: 'Дверна ручка',
  price: 245.5,
  inStock: true,
  quantityInPack: 10,
  categoryName: 'Ручки',
  categorySlug: 'handles',
  breadcrumbs: [
    { id: 5513, name: 'Фурнітура', slug: 'hardware' },
    { id: 14, name: 'Ручки', slug: 'handles' },
  ],
  media: [{ kind: 'photo', url: 'https://images-kedr.cdn.express/handle.jpg' }],
  updatedAt: null,
};
