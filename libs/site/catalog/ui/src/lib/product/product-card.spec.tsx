import { render, screen } from '@testing-library/react';

import { ProductGrid } from './product-grid';

import type { ProductSummary } from '@site/catalog/model';

vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));

const product: ProductSummary = {
  id: 7,
  slug: 'zavisa-agb',
  name: 'Завіса AGB',
  price: 245.5,
  photoUrl: 'https://images-kedr.cdn.express/~/o/products/7.jpg',
  isNew: true,
  isSale: false,
};

describe('ProductGrid', () => {
  it('links each product page and shows its photo, badge, and price', () => {
    render(<ProductGrid locale="uk" products={[product]} />);

    expect(screen.getByRole('link', { name: 'Завіса AGB' }).getAttribute('href')).toBe(
      '/uk/catalog/product/zavisa-agb',
    );
    expect(screen.getByRole('img', { name: 'Завіса AGB' })).toBeTruthy();
    expect(screen.getByText('Новинка')).toBeTruthy();
    expect(screen.getByText(/245,50 грн/)).toBeTruthy();
  });

  it('shows a placeholder and «price on request» when data is missing', () => {
    render(<ProductGrid locale="ru" products={[{ ...product, photoUrl: null, price: null }]} />);

    expect(screen.queryByRole('img')).toBeNull();
    expect(screen.getByText('Цена по запросу')).toBeTruthy();
  });
});
