import { parseProductDetails, parseProductPage } from './catalog-response.schema';

describe('catalog response validation', () => {
  it('accepts a valid product page and normalizes optional values later in the mapper', () => {
    const response = parseProductPage({
      pagedInfo: { pageNumber: 1, pageSize: 20, totalPages: 1, totalRecords: 1 },
      value: [
        {
          id: 1,
          name: 'Олія кедрова',
          productSlug: 'cedar-oil',
          photo: '/oil.jpg',
          inStock: true,
          isSale: false,
          isNew: true,
        },
      ],
    });

    expect(response.value[0]?.productSlug).toBe('cedar-oil');
  });

  it('rejects malformed product details through the shared error contract', () => {
    expect(() => parseProductDetails({ id: 'invalid' })).toThrow('Unknown error');
  });
});
