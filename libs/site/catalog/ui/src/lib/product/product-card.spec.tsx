import { fireEvent, render, screen } from '@testing-library/react';

import { ProductGrid } from './product-grid';
import { ProductList } from './product-list';

import type { ProductSummary } from '@site/catalog/model';

vi.mock('next/image', () => ({
  default: ({ src, alt, onError }: { src: string; alt: string; onError?: () => void }) => (
    <img src={src} alt={alt} onError={onError} />
  ),
}));

const product: ProductSummary = {
  id: '7',
  sku: 7,
  slug: 'zavisa-agb',
  name: 'Завіса AGB',
  price: 245.5,
  photoUrl: 'https://images-kedr.cdn.express/~/o/products/7.jpg',
  inStock: true,
  isNew: true,
  isSale: false,
  variantCount: 1,
  colors: [],
};

describe('ProductGrid', () => {
  it('links each product page and shows its photo, badge, and price', () => {
    render(<ProductGrid locale="uk" products={[product]} />);

    expect(screen.getByRole('link', { name: 'Завіса AGB' }).getAttribute('href')).toBe(
      '/uk/product/zavisa-agb',
    );
    expect(screen.getByRole('img', { name: 'Завіса AGB' })).toBeTruthy();
    expect(screen.getByText('Новинка')).toBeTruthy();
    expect(screen.getByText(/245,50 грн/)).toBeTruthy();
    expect(screen.getByText('Артикул 7')).toBeTruthy();
    expect(screen.getByText('В наявності')).toBeTruthy();
  });

  it('shows a placeholder and «price on request» when data is missing', () => {
    render(<ProductGrid locale="ru" products={[{ ...product, photoUrl: null, price: null }]} />);

    expect(screen.queryByRole('img')).toBeNull();
    expect(screen.getByText('Цена по запросу')).toBeTruthy();
  });

  it('falls back to the placeholder when the photo is missing on the CDN', () => {
    render(<ProductGrid locale="uk" products={[product]} />);

    fireEvent.error(screen.getByRole('img', { name: 'Завіса AGB' }));

    expect(screen.queryByRole('img')).toBeNull();
  });
});

describe('ProductList', () => {
  it('shows a table with SKU and stock in the table view', () => {
    render(<ProductList locale="ru" products={[{ ...product, inStock: false }]} view="table" />);

    expect(screen.getByRole('columnheader', { name: 'Артикул' })).toBeTruthy();
    expect(screen.getByRole('cell', { name: '7' })).toBeTruthy();
    expect(screen.getByText('Нет в наличии')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Завіса AGB' }).getAttribute('href')).toBe(
      '/ru/product/zavisa-agb',
    );
  });
});
