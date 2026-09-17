import { getProductImageCandidates, type CatalogProductDetails } from './catalog-product-details';

const product: CatalogProductDetails = {
  breadcrumbs: [],
  categoryName: 'Категорія',
  categorySlug: 'category',
  id: '1',
  imageUrl: 'https://example.com/photo.jpg',
  name: 'Товар',
  price: 100,
  quantityInPack: 2,
  schemeUrl: 'https://example.com/scheme.jpg',
  stock: 3,
};

describe('getProductImageCandidates', () => {
  it('keeps the main photo before a distinct scheme', () => {
    expect(getProductImageCandidates(product)).toEqual([product.imageUrl, product.schemeUrl]);
  });

  it('removes empty and duplicate images', () => {
    expect(getProductImageCandidates({ ...product, schemeUrl: product.imageUrl })).toEqual([
      product.imageUrl,
    ]);
    expect(getProductImageCandidates({ ...product, imageUrl: null, schemeUrl: null })).toEqual([]);
  });
});
