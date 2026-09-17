import {
  addProductToCart,
  calculateCartTotal,
  calculateLineAmount,
  canAddProductToCart,
  clearCart,
  decrementCartLine,
  incrementCartLine,
  removeCartLine,
  type CartProductInput,
} from './cart';

const product: CartProductInput = {
  id: 'product-1',
  name: 'Тестовий товар',
  imageUrl: 'https://example.com/product.jpg',
  unitPrice: 120,
  stock: 5,
  quantityInPack: 2,
};

describe('cart model', () => {
  it('adds one product and increments the existing line on repeated additions', () => {
    const first = addProductToCart([], product);
    const second = addProductToCart(first, product);

    expect(first).toEqual([{ ...product, quantity: 1 }]);
    expect(second).toEqual([{ ...product, quantity: 2 }]);
    expect(first[0].quantity).toBe(1);
  });

  it.each([
    [{ price: 120, stock: 1 }, true],
    [{ price: 0, stock: 1 }, true],
    [{ price: null, stock: 1 }, false],
    [{ price: 120, stock: 0 }, false],
  ])('checks whether a product can be added: %o', (input, expected) => {
    expect(canAddProductToCart(input)).toBe(expected);
  });

  it('increments and decrements quantity within the last known stock', () => {
    const line = { ...product, quantity: 4 };

    expect(incrementCartLine([line], product.id)).toEqual([{ ...line, quantity: 5 }]);
    expect(incrementCartLine([{ ...line, quantity: 5 }], product.id)).toEqual([
      { ...line, quantity: 5 },
    ]);
    expect(decrementCartLine([line], product.id)).toEqual([{ ...line, quantity: 3 }]);
    expect(decrementCartLine([{ ...line, quantity: 1 }], product.id)).toEqual([
      { ...line, quantity: 1 },
    ]);
  });

  it('removes one line or clears the complete cart', () => {
    const second = { ...product, id: 'product-2', quantity: 2 };
    const lines = [{ ...product, quantity: 1 }, second];

    expect(removeCartLine(lines, product.id)).toEqual([second]);
    expect(clearCart()).toEqual([]);
  });

  it('calculates two-decimal line and order totals without changing unit prices', () => {
    const lines = [
      { ...product, quantity: 3, unitPrice: 10.115 },
      { ...product, id: 'product-2', quantity: 2, unitPrice: 20.1 },
    ];

    expect(calculateLineAmount(lines[0])).toBe(30.35);
    expect(calculateCartTotal(lines)).toBe(70.55);
    expect(lines[0].unitPrice).toBe(10.115);
  });
});
