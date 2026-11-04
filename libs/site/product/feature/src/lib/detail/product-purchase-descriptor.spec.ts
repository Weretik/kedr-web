import { productPurchaseDescriptor } from './product-purchase-descriptor';
import { productFixture } from '../../test/product.fixture';

describe('product purchase descriptor', () => {
  it('projects the normalized product identifier and purchase facts without transport fields', () => {
    expect(productPurchaseDescriptor(productFixture)).toEqual({
      productId: '7',
      title: 'Дверна ручка',
      unitPrice: 245.5,
      currency: 'UAH',
      slug: 'handle-7',
      imageUrl: 'https://images-kedr.cdn.express/handle.jpg',
      available: true,
    });
  });

  it('uses the first real photo rather than a scheme as the cart thumbnail', () => {
    const descriptor = productPurchaseDescriptor({
      ...productFixture,
      media: [
        { kind: 'scheme', url: 'https://images-kedr.cdn.express/scheme.jpg' },
        ...productFixture.media,
        { kind: 'photo', url: 'https://images-kedr.cdn.express/other.jpg' },
      ],
    });

    expect(descriptor.imageUrl).toBe(productFixture.media[0]!.url);
  });

  it.each([
    { media: [] },
    { media: [{ kind: 'scheme' as const, url: 'https://images-kedr.cdn.express/scheme.jpg' }] },
  ])('omits the optional image when there is no product photo: %j', ({ media }) => {
    expect(productPurchaseDescriptor({ ...productFixture, media })).not.toHaveProperty('imageUrl');
  });

  it.each([
    { price: null, inStock: true },
    { price: 245.5, inStock: false },
    { price: null, inStock: false },
  ])('retains the existing contact policy for price=$price and stock=$inStock', (facts) => {
    expect(productPurchaseDescriptor({ ...productFixture, ...facts })).toMatchObject({
      unitPrice: facts.price,
      available: false,
    });
  });
});
