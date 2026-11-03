import type { ProductSeoInput } from '../lib/inputs/product-seo-input';

export const productSeoFixture: ProductSeoInput = {
  locale: 'uk',
  path: '/product/handle-7',
  name: 'Дверна ручка',
  sku: '7',
  categoryName: 'Ручки',
  price: 245.5,
  inStock: true,
  images: ['https://images-kedr.cdn.express/handle.jpg'],
  breadcrumbs: [
    { name: 'Головна', path: '/uk' },
    { name: 'Каталог', path: '/uk/catalog' },
    { name: 'Дверна ручка', path: '/uk/product/handle-7' },
  ],
  languagePaths: { uk: '/uk/product/handle-7' },
};
