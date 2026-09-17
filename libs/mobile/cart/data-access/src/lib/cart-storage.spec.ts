import AsyncStorage from '@react-native-async-storage/async-storage';

import { CART_STORAGE_KEY, clearStoredCart, loadCart, saveCart } from './cart-storage';

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    removeItem: jest.fn(),
    setItem: jest.fn(),
  },
}));

const storage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

describe('cart storage', () => {
  beforeEach(() => jest.clearAllMocks());

  it('restores valid persisted lines', async () => {
    const lines = [
      {
        id: 'product-1',
        name: 'Товар',
        imageUrl: null,
        unitPrice: 100,
        stock: 4,
        quantityInPack: 1,
        quantity: 2,
      },
    ];
    storage.getItem.mockResolvedValue(JSON.stringify(lines));

    await expect(loadCart()).resolves.toEqual({ error: false, lines });
    expect(storage.getItem).toHaveBeenCalledWith(CART_STORAGE_KEY);
  });

  it('returns a safe restore error for corrupted persisted data', async () => {
    storage.getItem.mockResolvedValue('{invalid');
    await expect(loadCart()).resolves.toEqual({ error: true, lines: [] });
  });

  it('returns a safe restore error when storage is unavailable', async () => {
    storage.getItem.mockRejectedValue(new Error('storage unavailable'));
    await expect(loadCart()).resolves.toEqual({ error: true, lines: [] });
  });

  it('persists cart lines', async () => {
    storage.setItem.mockResolvedValue();
    await saveCart([]);
    expect(storage.setItem).toHaveBeenCalledWith(CART_STORAGE_KEY, '[]');
  });

  it('removes the persisted cart after confirmed checkout', async () => {
    storage.removeItem.mockResolvedValue();

    await clearStoredCart();

    expect(storage.removeItem).toHaveBeenCalledWith(CART_STORAGE_KEY);
  });
});
