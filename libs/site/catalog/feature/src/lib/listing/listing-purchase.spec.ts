import { listingPurchaseDescriptor } from './listing-purchase';

const product = {
  id: '7',
  sku: 26821,
  slug: 'ruchka',
  name: 'Ручка',
  price: 245.5,
  photoUrl: 'https://cdn.example/1.jpg',
  inStock: true,
  isNew: false,
  isSale: false,
  variantCount: 1,
  colors: [],
};

describe('listingPurchaseDescriptor', () => {
  it('uses the SKU as the cart product id, as the product page does', () => {
    expect(listingPurchaseDescriptor(product)).toEqual({
      productId: '26821',
      title: 'Ручка',
      unitPrice: 245.5,
      currency: 'UAH',
      slug: 'ruchka',
      imageUrl: 'https://cdn.example/1.jpg',
      available: true,
    });
  });

  it('is not purchasable without stock or a price', () => {
    expect(listingPurchaseDescriptor({ ...product, inStock: false })?.available).toBe(false);
    expect(listingPurchaseDescriptor({ ...product, price: null })?.available).toBe(false);
  });

  it('gives nothing for a model of several products, which opens its page instead', () => {
    expect(listingPurchaseDescriptor({ ...product, sku: null, variantCount: 3 })).toBeNull();
  });
});
