import { renderToString } from 'react-dom/server';

import { ProductDetailView } from './product-detail-view';

import type { ProductDetails } from '@site/product/model';
import type { ImgHTMLAttributes } from 'react';

vi.mock('next/image', () => ({
  default: ({ src, alt }: ImgHTMLAttributes<HTMLImageElement>) => <img src={src} alt={alt} />,
}));

const product: ProductDetails = {
  sku: '00817',
  slug: 'ruchka',
  name: 'Ручка 817',
  price: 420,
  inStock: false,
  quantityInPack: null,
  categoryName: 'Ручки',
  categorySlug: 'ruchki',
  breadcrumbs: [],
  media: [],
  updatedAt: null,
};

describe('ProductDetailView server composition', () => {
  it.each([
    ['uk', 'Про товар', 'Немає в наявності'],
    ['ru', 'О товаре', 'Нет в наличии'],
  ] as const)(
    'exposes facts and real policy/anchor destinations before hydration in %s',
    (locale, about, stock) => {
      const html = renderToString(
        <ProductDetailView
          locale={locale}
          product={product}
          categoryHref={`/${locale}/catalog-owner/selected-category`}
          breadcrumbs={[
            { name: 'Каталог', href: `/${locale}/catalog` },
            { name: product.name, href: `/${locale}/product/${product.slug}` },
          ]}
        />,
      );
      const doc = new DOMParser().parseFromString(html, 'text/html');
      expect(doc.querySelectorAll('h1')).toHaveLength(1);
      expect(doc.querySelector('h1')?.textContent).toBe(product.name);
      expect(
        doc.querySelector(`a[href="/${locale}/catalog-owner/selected-category"]`)?.textContent,
      ).toBe(product.categoryName);
      expect(doc.querySelector(`a[href="/${locale}/catalog/${product.categorySlug}"]`)).toBeNull();
      expect(doc.body.textContent).toContain('00817');
      expect(doc.body.textContent).toContain('420');
      expect(doc.body.textContent).toContain(stock);
      expect(doc.querySelector('a[href="#product-facts"]')?.textContent).toBe(about);
      expect(doc.querySelector('#product-facts')?.hasAttribute('hidden')).toBe(false);
      expect(doc.querySelector(`a[href="/${locale}/delivery-and-payment"]`)).toBeTruthy();
      expect(doc.querySelector(`a[href="/${locale}/returns-exchanges"]`)).toBeTruthy();
      expect(doc.querySelector(`a[href="/${locale}/wholesale"]`)).toBeTruthy();
      expect(doc.querySelector('a[href^="tel:"]')).toBeTruthy();
      expect(doc.querySelector('[aria-current="page"]')?.textContent).toBe(product.name);
      expect(doc.body.textContent).not.toContain('DEMO-001');
    },
  );
  it('keeps the category label without inventing a destination when the feature supplies null', () => {
    const html = renderToString(
      <ProductDetailView locale="uk" product={product} categoryHref={null} breadcrumbs={[]} />,
    );
    const doc = new DOMParser().parseFromString(html, 'text/html');
    expect(doc.body.textContent).toContain(product.categoryName);
    expect(doc.querySelector('a[href="/uk/catalog/ruchki"]')).toBeNull();
  });
});
