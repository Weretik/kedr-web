import { mapProductSummary, toProductPhotoUrl } from './product-summary.mapper';

describe('mapProductSummary', () => {
  const item = {
    id: 7,
    name: ' Завіса AGB ',
    productSlug: 'zavisa-agb',
    photo: 'https://images-kedr.cdn.express/~/o/products/7.jpg',
    inStock: true,
    isSale: false,
    isNew: true,
    price: 245.5,
  };

  it('maps list items to summaries', () => {
    expect(mapProductSummary(item)).toEqual({
      id: 7,
      slug: 'zavisa-agb',
      name: 'Завіса AGB',
      price: 245.5,
      photoUrl: 'https://images-kedr.cdn.express/~/o/products/7.jpg',
      isNew: true,
      isSale: false,
    });
  });

  it('treats a missing or zero price as on request', () => {
    expect(mapProductSummary({ ...item, price: null }).price).toBeNull();
    expect(mapProductSummary({ ...item, price: 0 }).price).toBeNull();
  });

  it('keeps only HTTPS photos on the image CDN', () => {
    expect(toProductPhotoUrl('')).toBeNull();
    expect(toProductPhotoUrl('not a url')).toBeNull();
    expect(toProductPhotoUrl('http://images-kedr.cdn.express/a.jpg')).toBeNull();
    expect(toProductPhotoUrl('https://evil.example/a.jpg')).toBeNull();
  });
});
