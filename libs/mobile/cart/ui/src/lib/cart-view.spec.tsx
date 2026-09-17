import { fireEvent, render } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';

import { CartView } from './cart-view';

import type { CartLine } from '@mobile/cart/model';

const line: CartLine = {
  id: 'product-1',
  imageUrl: null,
  name: 'Товар',
  quantity: 2,
  quantityInPack: 1,
  stock: 3,
  unitPrice: 125,
};

describe('CartView', () => {
  it('keeps checkout visible but disabled while restoring', () => {
    const view = renderCart(
      <CartView
        isReady={false}
        lines={[]}
        onCheckout={jest.fn()}
        onDecrement={jest.fn()}
        onIncrement={jest.fn()}
        onRemove={jest.fn()}
        storageError={false}
        total={0}
      />,
    );

    expect(view.getByLabelText('Відновлення кошика')).toBeTruthy();
    expect(view.getByLabelText('Оформити замовлення').props.accessibilityState.disabled).toBe(true);
  });

  it('shows the empty cart and disables checkout', () => {
    const view = renderCart(
      <CartView
        isReady
        lines={[]}
        onCheckout={jest.fn()}
        onDecrement={jest.fn()}
        onIncrement={jest.fn()}
        onRemove={jest.fn()}
        storageError={false}
        total={0}
      />,
    );

    expect(view.getByText('Кошик порожній')).toBeTruthy();
    expect(view.getByLabelText('Оформити замовлення').props.accessibilityState.disabled).toBe(true);
  });

  it('renders totals and delegates accessible line actions', () => {
    const onIncrement = jest.fn();
    const onDecrement = jest.fn();
    const onRemove = jest.fn();
    const onCheckout = jest.fn();
    const view = renderCart(
      <CartView
        isReady
        lines={[line]}
        onCheckout={onCheckout}
        onDecrement={onDecrement}
        onIncrement={onIncrement}
        onRemove={onRemove}
        storageError={false}
        total={250}
      />,
    );

    expect(view.getAllByText('250 грн.')).toHaveLength(2);
    fireEvent.press(view.getByLabelText('Зменшити кількість Товар'));
    fireEvent.press(view.getByLabelText('Збільшити кількість Товар'));
    fireEvent.press(view.getByLabelText('Видалити Товар'));
    fireEvent.press(view.getByLabelText('Оформити замовлення'));

    expect(onDecrement).toHaveBeenCalledWith('product-1');
    expect(onIncrement).toHaveBeenCalledWith('product-1');
    expect(onRemove).toHaveBeenCalledWith('product-1');
    expect(onCheckout).toHaveBeenCalledTimes(1);
  });

  it('contains a product image inside a square white frame', () => {
    const view = renderCart(
      <CartView
        isReady
        lines={[{ ...line, imageUrl: 'https://example.com/product.png' }]}
        onCheckout={jest.fn()}
        onDecrement={jest.fn()}
        onIncrement={jest.fn()}
        onRemove={jest.fn()}
        storageError={false}
        total={250}
      />,
    );

    expect(view.getByTestId('cart-item-image-frame-product-1')).toHaveStyle({
      backgroundColor: '#ffffff',
      height: 88,
      width: 88,
    });
    expect(view.getByLabelText('Зображення Товар').props.contentFit).toBe('contain');
  });

  it('disables increment at the last known stock boundary', () => {
    const onIncrement = jest.fn();
    const view = renderCart(
      <CartView
        isReady
        lines={[{ ...line, quantity: 3 }]}
        onCheckout={jest.fn()}
        onDecrement={jest.fn()}
        onIncrement={onIncrement}
        onRemove={jest.fn()}
        storageError={false}
        total={375}
      />,
    );

    expect(view.getByLabelText('Збільшити кількість Товар').props.accessibilityState.disabled).toBe(
      true,
    );
    expect(onIncrement).not.toHaveBeenCalled();
  });
});

function renderCart(element: React.ReactElement) {
  return render(<PaperProvider theme={testTheme}>{element}</PaperProvider>);
}

const testTheme = {
  colors: {
    background: '#fff',
    error: '#c00',
    outlineVariant: '#ddd',
    surfaceVariant: '#eee',
  },
  dark: false,
};
