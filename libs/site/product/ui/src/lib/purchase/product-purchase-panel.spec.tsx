import { cleanup, render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';

import { ProductPurchasePanel } from './product-purchase-panel';

import type { ProductDetails } from '@site/product/model';

const product: ProductDetails = {
  sku: '00817',
  slug: 'ruchka',
  name: 'Ручка',
  price: 420,
  inStock: true,
  quantityInPack: 10,
  categoryName: 'Ручки',
  categorySlug: 'ruchki',
  breadcrumbs: [],
  media: [],
  updatedAt: null,
};

afterEach(cleanup);

describe('ProductPurchasePanel', () => {
  it('shows both missing-price and missing-stock facts and prioritizes stock contact', () => {
    render(
      <ProductPurchasePanel locale="uk" product={{ ...product, price: null, inStock: false }} />,
    );
    expect(screen.getByText('Ціна за запитом')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Уточнити наявність' }).getAttribute('href')).toBe(
      '/uk/contacts',
    );
    expect(screen.queryByRole('button', { name: 'У кошик' })).toBeNull();
    expect(screen.queryByRole('group', { name: 'Кількість' })).toBeNull();
  });

  it('keeps a known retail price while stock is unavailable', () => {
    render(<ProductPurchasePanel locale="ru" product={{ ...product, inStock: false }} />);
    expect(screen.getByText(/420/)).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Уточнить наличие' })).toBeTruthy();
  });

  it('offers a price request and no cart action for an available product without price', () => {
    render(<ProductPurchasePanel locale="ru" product={{ ...product, price: null }} />);
    expect(screen.getByText('Цена по запросу')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Запросить цену' }).getAttribute('href')).toBe(
      '/ru/contacts',
    );
    expect(screen.queryByRole('button', { name: 'В корзину' })).toBeNull();
  });

  it('keeps the actual cart action in an injection slot without owning cart state', () => {
    render(
      <ProductPurchasePanel
        locale="uk"
        product={product}
        purchaseAction={<button type="button">Actual cart action</button>}
      />,
    );
    expect(screen.getByRole('button', { name: 'Actual cart action' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'У кошик' })).toBeNull();
    expect(screen.getByText(/10 шт/)).toBeTruthy();
  });

  it('does not publish an enabled fake purchase before a cart action exists', () => {
    render(<ProductPurchasePanel locale="uk" product={product} />);
    expect(screen.getByRole('button', { name: 'У кошик' }).hasAttribute('disabled')).toBe(true);
    expect(
      screen.getByRole('button', { name: 'Збільшити кількість' }).hasAttribute('disabled'),
    ).toBe(true);
    expect(screen.queryByText('Додано')).toBeNull();
  });

  it.each([null, 0])('does not render an unknown/zero pack (%s)', (quantityInPack) => {
    render(<ProductPurchasePanel locale="uk" product={{ ...product, quantityInPack }} />);
    expect(screen.queryByText(/В упаковці/)).toBeNull();
  });

  it('renders price and pack as real server HTML without hydration', () => {
    const html = renderToString(<ProductPurchasePanel locale="uk" product={product} />);
    expect(html).toContain('420');
    expect(html).toContain('10');
    expect(html).toContain('Роздрібна ціна');
  });
});
